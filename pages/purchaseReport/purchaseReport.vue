<template>
	<view>
		<view class="fixed">
			<com-tab :tab-list="tabList" :tabCur.sync="tabCur" @change="tabChange" tab-class="tab" select-class="select-tab"></com-tab>
			<view class="count">
				<view class="count-item">
					<view class="name">采购笔数</view>
					<view class="con">{{total}}</view>
				</view>
				<view class="count-item">
					<view class="name">采购单品数</view>
					<view class="con" >{{count.numberTotal}}</view>
				</view>
				<view class="count-item">
					<view class="name">采购金额</view>
					<view class="con" >￥ {{formatMoney(count.costTotal)}}</view>
				</view>
			</view>
		</view>
		
		<mescroll-body top="220"  ref="mescrollRef" @init="mescrollInit"  @down="downCallback" :up="upOption" @up="upCallback">
			<uni-collapse>
			    <uni-collapse-item v-for="(item,index) in data">
					<template  v-slot:title>
						<view class="title" >
							<view class="goods">
								<view class="goods-img">
									<image :src="item.imgUrl"></image>
								</view>
								<view class="goods-con">
									<view class="name">
										<text class="name-text">{{item.goodsName}}</text>
										<view class="name-tag">
											<uni-tag v-if="item.flowType == 1" text="采购" type="error" :circle="true" size="small"></uni-tag>
											<uni-tag v-else text="采购退货" type="success" :circle="true" size="small"></uni-tag>
										</view>
									</view>
									<view class="info">
										<view class="sn">（{{item.goodsSn}}) - {{item.sizeName}}</view>
										<view class="price">{{formatMoney(item.totalBusinessPrice)}}</view>
									</view>
								</view>
								
							</view>
							<view class="num">
								<view>单价数量：<text>￥{{item.businessPrice}}</text>*<text class="n">{{item.number}}</text></view>
							</view>
							<view class="time">
								<view class="t">业务时间：{{dataFormat(item.createTime, 'yyyy-MM-dd hh:mm:ss')}}</view>
							</view>
						</view>
					</template>
					<view class="detailed">
						<view class="detailed-item">
							<text style="width: 100%;">订单编号：{{item.businessSn}}</text>
						</view>
						<view class="detailed-item">
							<text>单价：￥{{formatMoney(item.businessPrice)}}</text>
							<text>总价：￥{{formatMoney(item.totalBusinessPrice)}}</text>
						</view>
						<view class="detailed-item">
							<text>采购后均价：￥{{formatMoney(item.costPrice)}}</text>
							<text>采购后成本：￥{{formatMoney(item.costPrice * item.number)}}</text>
						</view>
					</view>
			    </uni-collapse-item>
			</uni-collapse>
		</mescroll-body>
	</view>
</template>

<script>
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	import { purchaseStatList, purchaseCount } from  '../../api/index.js'
	import { dataFormat, formatMoney } from '../../utils/util.js'
	export default {
		mixins: [MescrollMixin],
		data() {
			return {
				tabCur:0,
				tabList: [
					{ 
						type: 'thisMonth',
						name: '本月',
					},
					{ 
						type: 'thisYear',
						name: '本年',
					},
					{
						type: 'all',
						name: '全部',
					},
				],
				params: {
					page:1,
					size: 10,
					type: 'thisMonth'
				},
				total:0,
				data:[],
				count: {},
				upOption:{
					auto:false, // 不自动加载
					noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					empty:{
						tip: '~ 空空如也 ~', // 提示
						btnText: '去看看'
					}
				},
			}
		},
		onLoad() {
			this.getCount();
		},
		methods: {
			dataFormat(data, format){
				return dataFormat(data, format)
			},
			formatMoney(price){
				return formatMoney(price)
			},
			tabChange(index){
				this.params.type = this.tabList[index].type;
				this.reset()
			},
			upCallback(page) {
				this.params.page = page.num;
				this.params.size = page.size;
				this.getData()
			},
			reset(){
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 0
				})
				this.params.page = 1;
				this.data = []
				this.mescroll.resetUpScroll()
			},
			getData(){
				uni.showLoading()
				purchaseStatList(this.params).then(({data, total}) => {
					this.total = total;
					this.mescroll.endBySize(data.length, total);
					if(this.params.page == 1) this.data = []; 
					this.data = this.data.concat(data); 
				})
				.catch(()=>{
					this.mescroll.endErr();
				})
				.finally(res => {
					uni.hideLoading()
				})
			},
			getCount(){
				purchaseCount({
					type: this.params.type,
				}).then(res => {
					this.count = res.data;
				})
			},
		}
	}
</script>

<style lang="scss">
	.fixed{
		position: fixed;
		top:0;
		left: 0;
		right: 0;
		z-index: 1111;
		background-color: #fff;
		border-bottom: 1px solid $uni-border-color;
	}
.tab{
	background-color: #fff;
	border-top: 1px solid $uni-border-color;
	.wuc-tab-item{
		width: 33%;
		text-align: center;
		margin: 0;
		&.select-tab{
			color: $uni-color-primary;
			border-color: $uni-color-primary;
		}
	}
	
}
.count{
	height: 130rpx;
	display: flex;
	background-color: #fff;
	border-top: 1px solid $uni-border-color;
	.count-item{
		width: 33.33%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.name{
			font-size: 24rpx;
			color: #999;
		}
		.con{
			color: $uni-color-error;
			font-size: 28rpx;
			margin-top: 15rpx;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
	}
}
.title{
	padding: 24rpx 0 24rpx 24rpx;
	.goods{
		display: flex;
		.goods-img{
			width: 110rpx;
			padding-right: 10rpx;
			box-sizing: border-box;
			image{
				width: 100rpx;
				height: 64rpx;
			}
		}
		.goods-con{
			flex:1;
			.name{
				display: flex;
				justify-content: space-between;
				align-items: center;
				position: relative;
				.name-text{
					width: 435rpx;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					font-size: 32rpx;
					color: $uni-color-primary;
				}
				.name-tag{
					position: absolute;
					top:0;
					right: 0;
					bottom: 0;
					margin: auto;
				}
			}
			.info{
				display: flex;
				margin-top: 20rpx;
				.sn{
					flex:1;
					font-size: 24rpx;
					color: #555;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
				.price{
					font-size: 32rpx;
					color: $uni-color-warning;
				}
			}
		}
	}
	.num{
		font-size: 24rpx;
		margin-top: 20rpx;
		color: #555;
		text{
			margin-right: 10rpx;
		}
		.n{
			color: $uni-color-error;
			margin-left: 10rpx;
		}
	}
	.time{
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 24rpx;
		margin-top: 20rpx;
		color: #555;
		.negative{
			color: $uni-color-success;
		}
		.just{
			color: $uni-color-error;
		}
	}
}
.detailed{
	padding: 24rpx;
	border-top: 1px dashed $uni-border-color;
	.detailed-item{
		height: 40rpx;
		display: flex;
		
		text{
			width: 50%;
			font-size: 24rpx;
			color: #999;
		}
	}
}
</style>
