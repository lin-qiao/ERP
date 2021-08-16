<template>
	<view>
		<view class="goods">
			<uni-card>
				<view name="header">
					<view class="card-header">
						<view class="left"></view>
					</view>
				</view>
				<view class="goods-list">
					<view class="goods-item" v-for="item in goodsList" :key="item.id">
						<view class="goods-info">
							<text class="name">{{item.goodsName}}</text>
							<text>（{{item.goodsSn}}）</text>
						</view>
						<view class="goods-size-list">
							<view class="goods-size" v-for="subItem in item.sizeList" :key="subItem.sizeId">
								<text>{{subItem.sizeName}}</text>
								<text>￥{{formatMoney(subItem.price)}}</text>
								<text>{{subItem.quantity}}</text>
							</view>
						</view>
					</view>
				</view>
			</uni-card>
		</view>
		<view class="basic">
			<view class="basic-item">
				<text class="name">订单号：</text>
				<text class="text">{{detail.saleSn}}</text>
			</view>
			<view class="basic-item">
				<text class="name">业务时间：</text>
				<text class="text">{{dataFormat(detail.createTime, 'yyyy-MM-dd hh:mm:ss')}}</text>
			</view>
		</view>
		<view class="revoke" v-if="detail.status == 2"></view>
		<view class="btn" v-else @click="handleRevoke">撤销</view>
	</view>
</template>

<script>
	import {
		dataFormat,
		formatMoney
	} from '../../utils/util.js'
	import {
		saleDetail,
		saleBackout
	} from '../../api/index.js';
	export default {
		data() {
			return {
				saleSn: null,
				detail: {},
				goodsList: []
			}
		},
		onLoad(options) {
			this.saleSn = options.saleSn;
			this.getDataDetail()
		},
		methods: {
			formatMoney(price){
				return formatMoney(price)
			},
			dataFormat(data, format) {
				return dataFormat(data, format)
			},
			getDataDetail() {
				uni.showLoading()
				saleDetail({
					saleSn: this.saleSn
				}).then(res => {
					this.detail = res.data;
					let goodsList = [];
					res.data.goods.forEach(item => {
						const filter = goodsList.filter(obj => obj.goodsId == item.goodsId);
						if (filter.length) {
							filter[0].sizeList.push({
								price: item.price,
								quantity: item.quantity,
								sizeName: item.sizeName,
								sizeId: item.sizeId
							})
						} else {
							goodsList.push({
								goodsId: item.goodsId,
								goodsName: item.goodsName,
								goodsSn: item.goodsSn,
								sizeList: [{
									price: item.price,
									quantity: item.quantity,
									sizeName: item.sizeName,
									sizeId: item.sizeId
								}]
							})
						}
					})
					this.goodsList = goodsList;
				}).finally(res => {
					uni.hideLoading()
				})
			},
			//点击撤销
			handleRevoke(){
				uni.showModal({
				    title: '提示',
				    content: '你确定要撤销？',
				    success: (res) => {
				        if (res.confirm) {
				            this.revoke()
				        }
				    }
				});
			},
			//撤销
			revoke(){
				uni.showLoading()
				saleBackout({
					saleSn: this.saleSn,
					itemType: 2
				}).then(res => {
					this.detail.status = 2;
					uni.showToast({
						title: '撤销成功'
					})
				}).finally(res => {
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.goods {
		margin-bottom: 20rpx;

		/deep/ .uni-card {
			margin: 0;

			.uni-card__content {
				padding: 0;
			}
		}
	}

	.goods-item {
		padding: 0 24rpx;

		.goods-info {
			padding: 15rpx 0;
			font-size: 28rpx;
			line-height: 1.5;
			word-break: break-all;
			color: #333;
			border-bottom: 1rpx solid $uni-border-color;

			.name {
				color: $uni-color-primary;
			}

			image {
				width: 30rpx;
				height: 30rpx;
				margin-left: 20rpx;
			}
		}

		.goods-size-list {
			.goods-size {
				height: 80rpx;
				display: flex;
				align-items: center;
				border-bottom: 1rpx solid $uni-border-color;

				text {
					font-size: 28rpx;
					width: 33%;
					text-align: center;
				}

			}
		}
	}
	.basic{
		.basic-item{
			height: 80rpx;
			padding: 0 24rpx;
			display: flex;
			align-items: center;
			background-color: #fff;
			border-bottom: 1px solid $uni-border-color;
			font-size: 28rpx;
			.name{
				width: 200rpx;
			}
		}
	}
	
	.btn{
		height: 88pxrpx;
		line-height: 88rpx;
		background-color: $uni-color-primary;
		font-size: 30rpx;
		color: #fff;
		text-align: center;
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
	}
	.revoke{
		width: 190rpx;
		height: 250rpx;
		background: url(../../static/destroyMark.png) no-repeat;
		background-size: cover;
		background-position: center;
		position: absolute;
		top:40rpx;
		left: 0;
		right: 0;
		margin: auto;
		z-index: 11111;
	}
</style>
