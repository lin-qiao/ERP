<template>
	<view>
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" :up="upOption" @up="upCallback">
			<scroll-view class="list" scroll-y>
				<navigator class="item" hover-class="none" v-for="item in data" :key="item.id"
					:url="'/pages/takeOver/takeOver?expressNumber=' + item.expressNumber + '&status=' + item.status">
					<view class="left">
						<view class="sn">{{item.expressNumber}}</view>
						<view class="time">{{dataFormat(item.createTime, 'yyyy-MM-dd hh:mm:ss')}}</view>
					</view>
					<view class="right">
						<view class="num">商品数:{{item.totalNumber}}</view>
						<view :class="['status', item.status == 1? 'just': 'negative']">
							{{item.status == 1? '未扫描': '已扫描'}}</view>
					</view>
				</navigator>
			</scroll-view>
		</mescroll-body>
	</view>
</template>

<script>
	// #ifdef APP
	import pda from "@/utils/pda.js";
	// #endif
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	import {
		storageList
	} from '../../api/index.js'
	import {
		dataFormat,
		formatMoney
	} from '../../utils/util.js'
	export default {
		mixins: [MescrollMixin],
		data() {
			return {
				params: {
					page: 1,
					size: 10,
				},
				total: 0,
				data: [],
				upOption: {
					auto: false, // 不自动加载
					noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					empty: {
						tip: '~ 空空如也 ~', // 提示
						btnText: '去看看'
					}
				},
			}
		},
		onShow() {
			pda.stopScan();
			pda.startScan();
		},
		onHide() {
			pda.stopScan();
		},
		destroyed() {
			pda.stopScan();
		},
		methods: {
			//对接pda扫码
			handlePdaScan(code) {
				console.log(code)
				storageList({
					expressNumber: code
				}).then(res => {
					if (!res.data.length) {
						uni.showToast({
							title: '请先签收包裹',
							icon: 'none'
						})
						return;
					}
					uni.navigateTo({
						url: `/pages/takeOver/takeOver?expressNumber=${code}`
					})
				})
			},
			formatMoney(price) {
				return formatMoney(price)
			},
			dataFormat(data, format) {
				return dataFormat(data, format)
			},
			upCallback(page) {
				this.params.page = page.num;
				this.params.size = page.size;
				this.getData()
			},
			reset() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 0
				})
				this.params.page = 1;
				this.data = [] // 先置空列表,显示加载进度
				this.mescroll.resetUpScroll() // 再刷新列表数据
			},
			getData() {
				uni.showLoading()
				storageList(this.params).then(({
						data,
						total
					}) => {
						this.total = total;
						this.mescroll.endBySize(data.length, total);
						if (this.params.page == 1) this.data = [];
						this.data = this.data.concat(data);
					})
					.catch(() => {
						this.mescroll.endErr();
					})
					.finally(res => {
						uni.hideLoading()
					})
			},
		}
	}
</script>

<style lang="scss">
	.tab {
		background-color: #fff;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1111;

		.wuc-tab-item {
			width: 50%;
			text-align: center;
			margin: 0;

			&.select-tab {
				color: $uni-color-primary;
				border-color: $uni-color-primary;
			}
		}

	}

	.list {
		.item {
			height: 150rpx;
			background-color: #fff;
			border-bottom: 1px solid $uni-border-color;
			padding: 0 $uni-spacing-row-lg;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.left {
				font-size: 26rpx;
				color: $uni-text-color-grey;

				.time {
					margin-top: 10rpx;
				}
			}

			.right {
				font-size: 28rpx;
				text-align: right;

				.num {
					text-decoration: underline;
				}

				.status {
					color: $uni-color-error;
					margin-top: 20rpx;

					&.negative {
						color: $uni-color-success;
					}

					&.just {
						color: $uni-color-error;
					}
				}
			}
		}
	}
</style>