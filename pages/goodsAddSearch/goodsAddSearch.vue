<template>
	<view class="goods-add-search">
		<uni-search-bar :focus="true" placeholder="货号/名称" @input="search" v-model="code"></uni-search-bar>
		<view class="goods-list">
			<view class="goods-item" v-for="item in goodsList" :key="item.goodsId"  hover-class="none" @click="handleSelect(item)">
				<view class="img">
					<image :src="item.logoUrl" ></image>
				</view>
				<view class="con">
					<view class="goods-tit">{{item.title}}</view>
					<view class="goods-sn">{{item.articleNumber}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { getGoodsBySn } from '../../api/index.js'
	export default {
		data() {
			return {
				goodsList:[],
				code:'',
			}
		},
		methods: {
			search(){
				getGoodsBySn({code: this.code}).then(res => {
					this.goodsList = res.data;
				})
			},
			handleSelect(obj){
				uni.$emit('selectGoods', obj);
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss">
.goods-add-search{
	min-height: 100vh;
	background-color: #fff;
	padding: 0 $uni-spacing-row-lg 20rpx;
}
.goods-item{
		padding: 0 $uni-spacing-row-lg;
		display: flex;
		border-bottom: 1rpx solid $uni-border-color;
		background-color: #fff;
		.img{
			display: flex;
			justify-content: center;
			align-items: center;
			width: 196rpx;
			margin: 20rpx 0;
			position: relative;
			.number{
				position: absolute;
				bottom: 0;
				left: 0;
				right: 0;
				height: 40rpx;
				line-height: 40rpx;
				text-align: center;
				background-color: $uni-color-primary;
				font-size: 26rpx;
				color: #fff;
			}
			image{
				width: 150rpx;
				height: 96rpx;
				background: url(../../static/empty.png) no-repeat;
				background-size: cover;
			}
		}
		.con{
			flex:1;
			width: 0;
			.goods-tit{
				padding: 10rpx 10rpx 0;
				line-height: 70rpx;
				width: 100%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				font-size: 28rpx;
				color: #333;
			}
			.goods-sn{
				padding: 0 10rpx;
				line-height: 70rpx;
				width: 100%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				font-size: 28rpx;
				color: #333;
			}
			.goods-price{
				padding: 0 10rpx;
				line-height: 70rpx;
				width: 100%;
				font-size: 28rpx;
				color: $uni-color-error;
			}
		}
	}
</style>
