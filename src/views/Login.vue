<!--
 * @Author: your name
 * @Date: 2021-01-11 11:14:26
 * @LastEditTime: 2021-04-29 16:37:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue3-element-admin\src\views\Login.vue
-->
<template>
    <common
        ><div class="ve_container">
            <el-card :body-style="{ background: 'rgba(0,0,0,0.15)' }">
                <h1>进销存系统</h1>
                <transition name="el-fade-in-linear" v-if="type == 1">
                    <el-form
                        :model="form"
                        :rules="rules"
                        v-show="!success"
                        class="ve_form"
                        ref="ref_form"
                        :inline="false"
                        @keyup.enter="onSubmit"
                    >
                        <el-form-item prop="mobile">
                            <el-input
                                v-model.trim="mobile"
                                placeholder="用户名"
                                ><template #prepend
                                    ><i
                                        style="font-size:20px;"
                                        class="el-icon-user"
                                    ></i></template
                            ></el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input
                                v-model.trim="password"
                                show-password
                                placeholder="密码"
                                ><template prepend
                                    ><i
                                        style="font-size:20px;"
                                        class="el-icon-key"
                                    ></i></template
                            ></el-input>
                        </el-form-item>
						<el-form-item>
                            <el-button
                                class="ve_submit"
                                type="primary"
                                @click="onSubmit"
                                >登录</el-button
                            >
                        </el-form-item>
						<div class="register">
							<a href="javascript:;" @click="handleRegister">注册账号</a>
						</div>
                    </el-form>
                </transition>
				<transition name="el-fade-in-linear" v-else>
				    <el-form
				        :model="registerForm"
				        :rules="registerRules"
				        v-show="!success"
				        class="ve_form"
				        ref="ref_register_form"
				        :inline="false"
				        @keyup.enter="onRegisterSubmit"
				    >
				        <el-form-item prop="registerMobile">
				            <el-input
				                v-model.trim="registerMobile"
				                placeholder="手机号"
				                ><template #prepend
				                    ><i
				                        style="font-size:20px;"
				                        class="el-icon-user"
				                    ></i></template
				            ></el-input>
				        </el-form-item>
				        <el-form-item prop="registerPassword">
				            <el-input
				                v-model.trim="registerPassword"
				                show-password
				                placeholder="密码"
				                ><template prepend
				                    ><i
				                        style="font-size:20px;"
				                        class="el-icon-key"
				                    ></i></template
				            ></el-input>
				        </el-form-item>
						<el-form-item prop="registerAgPassword">
						    <el-input
						        v-model.trim="registerAgPassword"
						        show-password
						        placeholder="确认密码"
						        ><template prepend
						            ><i
						                style="font-size:20px;"
						                class="el-icon-key"
						            ></i></template
						    ></el-input>
						</el-form-item>
						
				        <el-form-item>
				            <el-button
				                class="ve_submit"
				                type="primary"
				                @click="onRegisterSubmit"
				                >注册</el-button
				            >
				        </el-form-item>
				    </el-form>
				</transition>
            </el-card>
        </div></common
    >
</template>

<script>
import Common from "@/components/Common";
import { ref, reactive, toRefs, getCurrentInstance } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";


export default {
    name: "Login",
    components: { Common },
    setup() {
		const { proxy } = getCurrentInstance();
        const store = useStore();
        const router = useRouter();
		const type =  ref(1);
        const form = reactive({
            mobile: "",
            password: ""
        });
		const registerForm = reactive({
			registerMobile: "",
			registerPassword: "",
			registerAgPassword: ""
		})
        const { mobile, password } = toRefs(form);
        const { registerMobile, registerPassword, registerAgPassword } = toRefs(registerForm);
        const ref_form = ref(null);
        const ref_register_form = ref(null);
		
        const success = ref(false);
        sessionStorage.clear();
        store.dispatch("app/set_token", "");
        router.options.isAddDynamicMenuRoutes = false;

		const rules = ref({
		    mobile: [{ required: true, message: "请输入手机号", trigger: "blur" }],
		    password: [{ required: true, message: "请输入密码", trigger: "blur" }]
		});
		const registerRules = ref({
		    registerMobile: [{ required: true, message: "请输入手机号", trigger: "blur" }],
		    registerPassword: [
				{ required: true, message: "请输入密码", trigger: "blur" },
			],
		    registerAgPassword: [
				{ required: true, message: "请再次输入密码", trigger: "blur" }
			]
		})
		
        const onSubmit = () => {
            ref_form.value.validate(async valid => {
                if (valid) {
                    const data = await VE_API.system.login(form);
                    if (data.code === 200) {
                        store.dispatch("app/set_token", data.token);
                        store.dispatch("app/set_uname", data.data.nickName);
                        success.value = true;
                        router.push({ name: "AppMain" });
                    }
                } else {
                    return;
                }
            });
        };
		
		const onRegisterSubmit = () => {
		    ref_register_form.value.validate(async valid => {
		        if (valid) {
					if(registerForm.registerPassword != registerForm.registerAgPassword){
						proxy.$message({
							type: "error",
							message: "两次输入密码不一致"
						});
						return;
					}
		            const data = await VE_API.system.register({
						mobile: registerForm.registerMobile,
						password: registerForm.registerPassword
					});
		            if (data.code === 200) {
		                store.dispatch("app/set_token", data.token);
		                store.dispatch("app/set_uname", data.data.nickName);
		                success.value = true;
		                router.push({ name: "AppMain" });
		            }
		        } else {
		            return;
		        }
		    });
		};
		
		/**
		  * @description 点击注册
		  * @param 
		  * @return 
		  */
		 
		const handleRegister = () => {
			type.value = 2;
		}
        return {
            success,
            form,
            ref_form,
			ref_register_form,
            mobile,
            password,
            rules,
            onSubmit,
			type,
			handleRegister,
			onRegisterSubmit,
			registerForm,
			registerMobile,
			registerPassword,
			registerAgPassword,
			registerRules
        };
    }
};
</script>

<style lang="scss" scoped>
	.register{
		text-align: left;
		color: $base_color;
		a{
			color: inherit;
			text-decoration: none;
		}
	}
.ve_container {
    position: absolute;
    z-index: 1;
    width: 400px;
    top: 50%;
    left: 100px;
    transform: translateY(-50%);
    transition: all 1s;
    min-height: 273px;
    text-align: center;
    h1 {
        font-size: 24px;
        transition: all 1s;
        font-weight: bold;
        margin-bottom: 36px;
    }
    .ve_form {
        .ve_submit {
            width: 100%;
        }
        :deep(.el-input-group__prepend) {
            padding: 0 10px;
        }
    }
}
</style>
