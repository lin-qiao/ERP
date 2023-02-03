<template>
	<view>
		<view class="top-wrap">
			<view class="fixed">
				<com-tab :tab-list="tabList" :tabCur.sync="tabCur" @change="tabChange" tab-class="tab"
					select-class="select-tab"></com-tab>
				<view class="count">
					<view class="count-item">
						<view class="name">单品数</view>
						<view class="con">{{count.numberTotal}}</view>
					</view>
					<view class="count-item">
						<view class="name">销售额</view>
						<view class="con">￥ {{formatMoney(count.priceTotal)}}</view>
					</view>
					<view class="count-item">
						<view class="name">利润</view>
						<view class="con">￥ {{formatMoney(count.grossProfitTotal)}}</view>
					</view>
					<view class="count-item">
						<view class="name">利润率（%）</view>
						<view class="con">{{count.grossProfitRate || 0}}</view>
					</view>
				</view>
				<view class="nav-list">
					<view :class="['nav-item', {'on': item.type != ''}]" v-for="(item, index) in navList" :key="index"
						@click="handleNav(index)">
						<uni-icons v-if="item.type" :type="item.type == 'desc'? item.icon: item.selectIcon" size="12">
						</uni-icons>
						<text>{{item.label}}</text>
					</view>
				</view>
			</view>
		</view>
		<mescroll-body top="290" ref="mescrollRef" @init="mescrollInit" @down="downCallback" :up="upOption"
			@up="upCallback">
			<scroll-view class="sale-list" scroll-y>
				<view class="sale-item" v-for="(item,index) in list" :key="index">
					<view class="goods">
						<view class="goods-name">{{item.brandName}}</view>
						<view class="price red">￥{{formatMoney(item.businessPriceToTal)}}</view>
					</view>
					<view class="goods-info">
						<view class="info-item">
							<view class="number">单价数量：￥{{formatMoney(item.businessPrice)}} * <text
									class="red" style="margin-left: 5rpx;">{{item.number}}</text></view>
							<view class="profit">利润：<text :class="item.grossProfitPrice > 0? 'red': 'green'">￥{{item.grossProfitPrice > 0? '+' : ''}}{{formatMoney(item.grossProfitPrice)}}</text></view>
						</view>
					</view>
					<view class="detailed">
						<view class="detailed-item">
							<text>成本：￥{{formatMoney(item.costPriceTotal)}}</text>
							<text>销售额：￥{{formatMoney(item.businessPriceToTal)}}</text>
						</view>
						<view class="detailed-item">
							<text>利润：￥{{formatMoney(item.grossProfitPrice)}}</text>
							<text>利润率（%）：{{(item.grossProfitRate || 0).toFixed(2)}}</text>
						</view>
					</view>
				</view>
		
			</scroll-view>
		</mescroll-body>
	</view>
	
</template>

<script>
	import {
		formatMoney
	} from '../../utils/util.js'
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	import {
		brandSaleStatList,
		saleCount
	} from '../../api/index.js'
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				upOption: {
					empty: {
						tip: '~ 搜索无数据 ~', // 提示
						btnText: '去看看'
					}
				},
				tabCur: 0,
				tabList: [{
						type: 'thisMonth',
						name: '本月',
					},
					{
						type: 'lastMonth',
						name: '上月',
					},
					{
						type: 'thisYear',
						name: '本年',
					},
					{
						type: 'lastYear',
						name: '上年',
					},
					{
						type: 'all',
						name: '全部',
					},
				],
				navList: [{
						type: '',
						icon: 'arrowthindown',
						selectIcon: 'arrowthinup',
						name: 'number',
						label: '单品数量'
					},
					{
						type: '',
						icon: 'arrowthindown',
						selectIcon: 'arrowthinup',
						name: 'businessPriceToTal',
						label: '销售额'
					},
					{
						type: 'desc',
						icon: 'arrowthindown',
						selectIcon: 'arrowthinup',
						name: 'grossProfitPrice',
						label: '利润'
					}
				],
				params: {
					page: 1,
					size: 10,
					type: 'thisMonth',
					order: 'grossProfitPrice desc',
				},
				list: [],
				count: {}
			}
		},
		onLoad() {
			this.getCount()
		},
		methods: {
			formatMoney(price) {
				return formatMoney(price)
			},
			getCount(){
				saleCount({
					type: this.params.type,
				}).then(res => {
					this.count = res.data;
				})
			},
			tabChange(index) {
				this.params.type = this.tabList[index].type;
				this.reset();
				this.getCount();
			},
			/**
			 * @description 点击tab
			 * @param 
			 * @return 
			 */
			handleNav(index) {
				this.navList.forEach((item, i) => {
					if (index != i) {
						item.type = '';
					}
				})
				const obj = this.navList[index];

				if (obj.type == '') {
					obj.type = 'desc';
				} else if (obj.type == 'desc') {
					obj.type = 'asc';
				} else if (obj.type == 'asc') {
					obj.type = 'desc';
				}
				this.params.order = obj.name + ' ' + obj.type;
				this.reset()
			},
			reset() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 0
				})
				this.params.page = 1;
				this.list = [] // 先置空列表,显示加载进度
				this.mescroll.resetUpScroll() // 再刷新列表数据
			},
			/**
			 * @description 获取数据
			 * @param 
			 * @return 
			 */
			getData() {
				brandSaleStatList(this.params).then(({
						data,
						total
					}) => {
						this.total = total;
						this.mescroll.endBySize(data.length, total);
						if (this.params.page == 1) this.list = [];
						this.list = this.list.concat(data);
					})
					.catch(() => {
						this.mescroll.endErr();
					})
			},

			upCallback(page) {
				this.params.page = page.num;
				this.params.size = page.size;
				this.getData()
			},
		}
	}
</script>

<style lang="scss">
	.red {
		color: $uni-color-error;
	}
	.green{
		color: $uni-color-success;
	}
	.fixed {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1111;
		background-color: #fff;
		border-bottom: 1px solid $uni-border-color;
	}

	.tab {
		background-color: #fff;
		border-top: 1px solid $uni-border-color;

		.wuc-tab-item {
			width: 20%;
			text-align: center;
			margin: 0;

			&.select-tab {
				color: $uni-color-primary;
				border-color: $uni-color-primary;
			}
		}

	}

	.count {
		height: 130rpx;
		display: flex;
		background-color: #fff;
		border-top: 1px solid $uni-border-color;

		.count-item {
			width: 25%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.name {
				font-size: 24rpx;
				color: #999;
			}

			.con {
				color: $uni-color-error;
				font-size: 28rpx;
				margin-top: 15rpx;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}
	}

	.top-wrap {
		z-index: 9990;
		position: fixed;
		top: --window-top;
		left: 0;
		width: 100%;
		height: 276rpx;
		background-color: white;
	}

	.uni-icons {
		color: inherit !important;
	}

	.stat {
		display: flex;
		height: 110rpx;

		.stat-item {
			width: 50%;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;

			.con {
				color: $uni-text-color;
				font-size: 32rpx;
			}

			.text {
				color: $uni-text-color-grey;
				font-size: 24rpx;
				margin-top: 5rpx;
			}
		}
	}

	.nav-list {
		height: 70rpx;
		display: flex;
		border-top: 1rpx solid $uni-border-color;

		.nav-item {
			width: 33.33%;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 28rpx;
			color: $uni-text-color;

			&.on {
				color: $uni-color-primary;
			}
		}
	}

	.sale-list{
		.sale-item{
			padding: $uni-spacing-col-lg $uni-spacing-row-lg;
			background-color: #fff;
			border-bottom: 1px solid $uni-border-color;
			.goods{
				padding: 12rpx $uni-spacing-row-lg;
				display: flex;
				justify-content: space-between;
				.goods-name{
					font-size: 32rpx;
					color: #333;
				}
				.price{
					font-size: 32rpx;
				}
			}
			
		}
	}
	.goods-info{
		padding: 12rpx $uni-spacing-row-lg;
		.info-item{
			height: 40rpx;
			display: flex;
			justify-content: space-between;
			view{
				font-size: 24rpx;
				color: #666;
			}
		}
	}
	.detailed{
		padding: $uni-spacing-col-lg $uni-spacing-row-lg 0;
		border-top: 1px dashed $uni-border-color;
		.detailed-item{
			height: 40rpx;
			line-height: 40rpx;
			display: flex;
			
			text{
				width: 50%;
				font-size: 24rpx;
				color: #999;
			}
		}
	}
</style>
