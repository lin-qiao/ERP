<template>
	<view class="takeOver">
		<uni-list>
			<uni-list-item title="快递单号" :rightText="expressNumber"></uni-list-item>
		</uni-list>
		<uni-section title="商品列表" type="line"></uni-section>
		<view class="good-list">
			<view class="good-item" v-for="(item, index) in goodsList">
				<view class="good-img">
					<image :src="item.goodsImg"></image>
				</view>
				<view class="good-con">
					<view class="good-tit">{{ item.goodsName }}</view>
					<view class="good-sn">
						<text class="bh">{{ item.goodsSn }}</text>
						<text class="size">{{ item.sizeName }}</text>
					</view>
				</view>
				<view class="good-num">
					<uni-number-box :min="1" v-model="item.number" />
				</view>
				<view class="good-del">
					<uni-icons type="trash" size="12" @click="handleDel(index)"></uni-icons>
				</view>
			</view>
		</view>
		<view class="btns">
			<view class="btn submit" @click="handleSubmit" v-if="status == 1">入库</view>
		</view>
	</view>
</template>

<script>
	// #ifdef APP
	import pda from "@/utils/pda.js";
	// #endif
	import {
		getGoodsByCode,
		storageGoodsAdd,
		storageGoodsList,
		storageDetail 
	} from "../../api/index.js";
	export default {
		data() {
			return {
				status: "",
				expressNumber: "",
				goodsList: [],
			};
		},
		onLoad(options) {
			this.expressNumber = options.expressNumber;
			this.getGoodsList();
			this.getDetail();
			pda.stopScan();
			pda.startScan();
		},
		destroyed() {
			console.log("销毁");
			pda.stopScan();
		},
		methods: {
			getGoodsList() {
				storageGoodsList({
					expressNumber: this.expressNumber
				}).then((res) => {
					this.goodsList = res.data;
				});
			},
			getDetail() {
				storageDetail({
					expressNumber: this.expressNumber
				}).then((res) => {
					this.status = res.data.status;
				});
			},
			//对接pda扫码
			handlePdaScan(code) {
				getGoodsByCode({
					code,
				}).then((res) => {
					if (!res.data) {
						uni.showToast({
							title: "该条形码未绑定商品",
							icon: "none",
						});
						return;
					}
					const filter = this.goodsList.filter(item => item.goodsId == res.data.goodsId && item.sizeId == res.data.sizeId)
					if (filter.length) {
						filter[0].number += 1;
					} else {
						this.goodsList.push({
							goodsId: res.data.goodsId,
							goodsSn: res.data.goodsSn,
							goodsName: res.data.goodsName,
							goodsImg: res.data.goodsImg,
							codeNumber: code,
							sizeId: res.data.sizeId,
							sizeName: res.data.sizeName,
							number: 1,
						});
					}
				});
			},
			handleDel(index) {
				this.goodsList.splice(index, 1);
			},
			handleSubmit() {
				if (!this.goodsList.length) {
					uni.showToast({
						title: "请先扫描商品",
						icon: "none",
					});
					return;
				}
				storageGoodsAdd({
					expressNumber: this.expressNumber,
					goodsList: this.goodsList,
				}).then((res) => {
					uni.showToast({
						title: "入库成功",
					});
					setTimeout(() => {
						uni.navigateBack({
							delta: 1,
						});
					}, 1500);
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.takeOver {
		box-sizing: border-box;
		padding: 30rpx $uni-spacing-row-lg;
		background-color: #fff;
	}

	.express-input {
		border-bottom: 1px solid $uni-border-color;
		text-align: right;
		font-size: 28rpx;
		color: #3b4144;
		flex: 1;
	}

	/deep/ .uni-section {
		margin-top: 0 !important;
		background-color: transparent !important;
		margin-left: -$uni-spacing-row-lg;
		margin-right: -$uni-spacing-row-lg;
		height: 88rpx !important;

		.uni-section__head-tag {
			background-color: $uni-color-primary !important;
		}
	}

	.good-list {
		.good-item {
			display: flex;
			align-items: center;
			position: relative;
			padding: 30rpx 0;
			border-bottom: 1px solid $uni-border-color;

			.good-img {
				width: 150rpx;

				image {
					width: 150rpx;
					height: 96rpx;
					background: url(../../static/empty.png) no-repeat;
					background-size: cover;
				}
			}

			.good-con {
				flex: 1;
				min-width: 0;
				padding-left: 10rpx;

				.good-tit {
					box-sizing: border-box;
					width: 100%;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					font-size: 26rpx;
					color: #666;
				}

				.good-sn {
					display: flex;
					font-size: 28rpx;
					color: #333;
					margin-top: 10rpx;

					.bh {
						flex: 1;
						width: 0;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}

					.size {
						width: 60rpx;
					}
				}
			}

			.good-num {
				padding: 0 10rpx;
			}

			.good-del {
				position: absolute;
				right: 0;
				top: 0;
				width: 30rpx;
				height: 35rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				// /deep/ .uni-icons{
				// 	color: $uni-color-error !important;
				// }
			}
		}
	}

	.scan-btn {
		display: flex;

		.btn {
			flex: 1;
			line-height: 88rpx;
			background-color: $uni-color-primary;
			font-size: 30rpx;
			color: #fff;
			text-align: center;

			&.del {
				background-color: $uni-color-error;
			}
		}
	}

	.btns {
		display: flex;
		position: fixed;
		height: 88pxrpx;
		bottom: 0;
		left: 0;
		right: 0;

		.btn {
			flex: 1;
			line-height: 88rpx;
			font-size: 30rpx;
			text-align: center;
			color: #666;
			border: 1px solid $uni-border-color;

			&.submit {
				color: #fff;
				background-color: $uni-color-primary;
				border-color: $uni-color-primary;
			}
		}
	}
</style>