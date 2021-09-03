<template>
	<view class="login-box">
		<view class="uni-header no-padding">
			<view class="uni-title">系统登录</view>
		</view>
		<view class="uni-container">
			<uni-forms ref="form" v-model="formData" :rules="rules" @submit="submit">
				<uni-forms-item left-icon="person-filled" name="mobile" labelWidth="35">
					<input ref="mobileInput" @confirm="submitForm" class="input-border" type="text"
						placeholder="账户" v-model="formData.mobile" />
				</uni-forms-item>
				<uni-forms-item left-icon="locked-filled" class="icon-container" name="password" labelWidth="35">
					<input ref="passwordInput" type="password" @confirm="submitForm" class="input-border"
						placeholder="密码" v-model="formData.password" />
				</uni-forms-item>
				<view class="btn" @click="submitForm">登录</view>
			</uni-forms>
		</view>
	</view>
</template>

<script>
	import {
		login
	} from '../../api/index.js'


	export default {
		data() {
			return {
				formData: {
					mobile: '',
					password: '',
				},
				rules: {
					// 对name字段进行必填验证
					mobile: {
						rules: [{
								required: true,
								errorMessage: '请输入账户',
							}
						]
					},
					// 对email字段进行必填验证
					password: {
						rules: [{
								required: true,
								errorMessage: '请输入正确的密码',
							},
						]
					}
				}
			}
		},
		methods: {
			submit(event) {
				
				const {
					errors,
					value
				} = event.detail
				if (errors) {
					return
				}
				uni.showLoading({
					title:'正在登录中...',
					mask: true
				})
				login(this.formData).then(res => {
					uni.setStorageSync('token', res.token)
					uni.setStorageSync('userInfo', res.data);
					uni.showToast({
						title: '登录成功',
						icon: 'none',
						success: () => {
							uni.switchTab({
								url: '/pages/index/index',
							})
						}
					})
					
				})
				.finally(err => {
					uni.hideLoading()
				})
			},

			submitForm() {
				this.$refs.form.submit()
			},
		}
	}
</script>

<style lang="scss" scoped>
	page {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		background-color: #fff;
	}
	.uni-container{
		padding: 15rpx 0;
	}
	.input-border{
		width: 100%;
		height: 70rpx;
		border-bottom: 1px solid $uni-border-color;
		padding: 0 $uni-spacing-row-lg;
		font-size: 28rpx;
	}
	.btn{
		width: 100%;
		height:70rpx;
		line-height:70rpx;
		background-color: $uni-color-primary;
		font-size: 30rpx;
		color: #fff;
		text-align: center;
		margin: 25rpx auto;
	}

	.login-box {
		position: relative;
		max-width: 350px;
		flex: 1;
		padding: 140px 35px 0;
		margin: 0 auto;
		overflow: hidden;
		/* background-color: #F5F5F5; */
	}


	.underline:hover {
		text-decoration: underline;
	}

	.uni-tips {
		display: flex;
		justify-content: flex-end;
		margin-top: 15px;
	}

	.uni-tips-text {
		cursor: pointer;
		text-decoration: underline;
		font-size: 26rpx;
		color: #007AFF;
		opacity: 0.8;
	}

	.no-padding {
		padding: 0;
	}



	@-webkit-keyframes uni-loading {
		0% {
			-webkit-transform: rotate(0deg);
			transform: rotate(0deg)
		}

		to {
			-webkit-transform: rotate(1turn);
			transform: rotate(1turn)
		}
	}

	@keyframes uni-loading {
		0% {
			-webkit-transform: rotate(0deg);
			transform: rotate(0deg)
		}

		to {
			-webkit-transform: rotate(1turn);
			transform: rotate(1turn)
		}
	}
</style>
