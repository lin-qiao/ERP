<template>
	<el-dialog
	    :title="title"
	    append-to-body
	    destroy-on-close
	    :model-value="showDialog"
	    @close="closeDialog()"
	>
		<el-form
		    ref="formRef"
		    :model="form"
		    label-width="80px"
		    :rules="rules"
		    :inline="false"
		>
			<el-form-item label="供应商" prop="supplierName">
			    <el-input
			        clearable
			        v-model="supplierName"
			        placeholder="请输入供应商名称"
			    ></el-input>
			</el-form-item>
			<el-form-item label="联系方式" prop="contact">
			    <el-input
			        clearable
			        v-model="contact"
			        placeholder="请输入联系方式"
			    ></el-input>
			</el-form-item>
		</el-form>
		<template v-slot:footer>
			<span>
				<el-button @click="closeDialog()">取消</el-button>
				<el-button type="primary" @click="onSubmit()">确定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script>
	import {
		ref,
		reactive,
		toRefs,
		computed,
		onMounted
	} from 'vue';
	
	export default {
		props:{
			title:{
				type: String,
				default: '添加'
			},
			rowData: {
			    type: Object,
			    default: null
			},
			showDialog: {
				type: Boolean,
				default: false
			}
		},
		emits:['closeDialog'],
		setup(props, { emit }){
			
			const { rowData } = toRefs(props);
			
			const formRef = ref(null);
			const form = reactive({
				supplierName: '',
				contact: ''
			})
			const { supplierName, contact } = toRefs(form);
			
			/**
			  * @description 初始化表单
			  * @param 
			  * @return 
			  */
			rowData.value  && (
				form.supplierName = rowData.value.supplierName,
				form.contact = rowData.value.contact
			)
			
			/* 表单规则 */
			const rules = computed(() => ({
				supplierName: {
					required: true,
					message: "请输入供应商名称",
					trigger: "blur"
				},
				contact: {
					required: true,
					message: "请输入电话或者邮箱",
					trigger: "blur"
				}
			}))
			
			/* 提交表单 */
			const onSubmit = () => {
				formRef.value.validate(async valid => {
				    if (valid) {
				        let res;
				        if (rowData.value && rowData.value.id) {
				        	res = await VE_API.supplier.supplierUpdate({
				        	    id: rowData.value.id,
				        	    ...form
				        	});
				        } else {
				            res = await VE_API.supplier.supplierAdd(form);
				        }
				        const { code } = res;
				        if (code == 200) {
				            closeDialog();
				        }
				    }
				});
			}
			const closeDialog = () => {
				emit('closeDialog', false)
			}
			
			return {
				formRef,
				form,
				supplierName,
				contact,
				onSubmit,
				rules,
				closeDialog
			}
		}
	}
</script>

<style>
</style>
