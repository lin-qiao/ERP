<template>
	<view>
		<uni-list>
			<uni-list-chat :avatar-circle="true" :title="userInfo.mobile" avatar="/static/my.png" note="生意大卖"></uni-list-chat>
		</uni-list>
		<view class="btn" @click="handleLogout">退出登录</view>
	</view>
</template>

<script>
	import { userInfo } from '../../api/index.js'
	export default {
		data() {
			return {
				userInfo: {},
			}
		},
		onLoad() {
			this.getUserInfo()
		},
		methods: {
			getUserInfo(){
				userInfo().then(res => {
					this.userInfo  = res.data;
				})
			},
			handleLogout(){
				uni.showModal({
				    title: '提示',
				    content: '你确定要退出登录？',
				    success: (res) => {
				        if (res.confirm) {
				            uni.removeStorageSync('token');
				            uni.redirectTo({
				            	url: '/pages/login/login'
				            })
				        }
				    }
				});
				
			},
		}
	}
</script>

<style lang="scss">
.btn{
	width: 700rpx;
	height: 88pxrpx;
	line-height: 88rpx;
	background-color: $uni-color-primary;
	font-size: 30rpx;
	color: #fff;
	text-align: center;
	margin: 25rpx auto;
}
</style>
