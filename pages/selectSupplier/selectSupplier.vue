<template>
	<view class="supplier-list">
		<view class="supplier-item" v-for="item in list" @click="handleSelect(item)">
			<view class="name">{{item.supplierName}}</view>
			<view class="phone">联系方式：{{item.contact}}</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: []
			}
		},
		onLoad() {
			this.list = uni.getStorageSync('supplierList');
		},
		methods: {
			handleSelect(obj){
				uni.setStorageSync('supplier', obj);
				uni.navigateBack();
			}
		}
	}
</script>

<style lang="scss" scoped>
.supplier-list{
	.supplier-item{
		padding: 40rpx $uni-spacing-row-lg;
		background-color: #fff;
		border-bottom: 1px solid $uni-border-color;
		.name{
			font-size: 30rpx;
		}
		.phone{
			font-size: 26rpx;
			color: #999;
			margin-top: 10rpx;
		}
	}
}
</style>
