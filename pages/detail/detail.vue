<template>
	<view class="bg-white">
		<view class="goods-img">
			<image :src="detail.img_url"></image>
		</view>
		<view class="goods-con">
			{{detail.name}}  <text class="sn">({{detail.good_sn}})</text>
		</view>
		<view class="stock">
			<view class="stock-tit stock-flow" @click="toStockFlow">查看库存变动记录（库存流水）>></view>
			<view class="stock-tit">库存列表</view>
			<view class="stock-list">
				<view class="stock-item">
					<view class="con">尺码</view>
					<view class="con">当前库存</view>
					<view class="con">成本</view>
				</view>
				<view class="stock-item" v-for="item in stockList">
					<view class="con">{{item.sizeName}}</view>
					<view class="con">{{item.number}}</view>
					<view class="con">{{item.costPrice.toFixed(2)}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { getGoodsStock } from '../../api/index.js'
	export default {
		data() {
			return {
				detail: {},
				stockList: []
			}
		},
		onLoad(options) {
			this.getGoodsStock(options.id)
		},
		methods: {
			toStockFlow(){
				uni.setStorageSync('stockSizeList', this.stockList)
				uni.navigateTo({
					url: '/pages/stockFlow/stockFlow?id=' + this.detail.id
				})
			},
			getGoodsStock(id){
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				getGoodsStock({goodsId: id}).then(res => {
					this.detail = res.detail;
					this.stockList = res.data;
				}).finally(() => {
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style lang="scss">
.goods-img{
	height: 240rpx;
	background-color:$uni-bg-color-hover;
	display: flex;
	justify-content: center;
	align-items: center;
	image{
		height: 200rpx;
		width: 312rpx;
		background: url(../../static/empty.png) no-repeat;
		background-size: cover;
	}
}
.goods-con{
	padding: $uni-spacing-col-lg $uni-spacing-row-lg;
	line-height: 1.5;
	font-size: 32rpx;
	color: #333;
	word-wrap: break-word;
	word-break: break-all;
	white-space: pre-wrap !important;
	.sn{
		font-size: 28rpx;
		color: $uni-text-color-grey;
		padding: 0 10rpx;
	}
}
.stock{
	.stock-tit{
		height: 80rpx;
		line-height: 80rpx;
		padding: 0 $uni-spacing-row-lg;
		font-size: 26rpx;
		color: #333;
		border-bottom: 1rpx solid $uni-border-color;
		&.stock-flow{
			border-top: 1rpx solid $uni-border-color;
			color: $uni-color-primary;
			text-align: right;
		}
	}
	.stock-list{
		.stock-item{
			display: flex;
			height: 50rpx;
			line-height: 50rpx;
			border-bottom: 1rpx solid #f5f5f5;
			.con{
				width: 33%;
				display: flex;
				padding-left: 40rpx;
				align-items: center;
				color: #333;
				font-size: 24rpx;
			}
			&:last-child{
				border-bottom: 1rpx solid $uni-border-color;
			}
		}
	}
}
</style>
