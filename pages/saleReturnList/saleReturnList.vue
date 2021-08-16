<template>
	<view>
		<com-tab :tab-list="tabList" :tabCur.sync="tabCur" @change="tabChange" tab-class="tab" select-class="select-tab"></com-tab>
		<mescroll-body top="90" ref="mescrollRef" @init="mescrollInit"  @down="downCallback" :up="upOption" @up="upCallback">
			<scroll-view class="list" scroll-y>
				<navigator class="item"  hover-class="none" v-for="item in data" :key="item.id" :url="'/pages/saleReturnDetail/saleReturnDetail?saleSn=' + item.saleSn">
					<view class="left">
						<view class="sn">{{item.saleSn}}</view>
						<view class="time">{{dataFormat(item.createTime, 'yyyy-MM-dd hh:mm:ss')}}</view>
					</view>
					<view class="right">
						<view class="num">退:{{item.totalNumber}}</view>
						<view class="price">￥{{formatMoney(item.totalPrice)}}</view>
					</view>
				</navigator>
			</scroll-view>
		</mescroll-body>
	</view>
</template>

<script>
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	import { saleList } from  '../../api/index.js'
	import { dataFormat,formatMoney } from '../../utils/util.js'
	export default {
		mixins: [MescrollMixin],
		data() {
			return {
				tabCur:0,
				tabList: [
					{ 
						name: '已退货',
					},
					{ 
						name: '已撤销',
					}
				],
				params: {
					page:1,
					size: 10,
					status: 1,
					itemType: 2
				},
				total:0,
				data: [],
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
		onShow() {
			this.reset();
		},
		methods: {
			formatMoney(price){
				return formatMoney(price)
			},
			dataFormat(data, format){
				return dataFormat(data, format)
			},
			tabChange(index){
				this.params.status = index + 1;
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
				this.data = []// 先置空列表,显示加载进度
				this.mescroll.resetUpScroll() // 再刷新列表数据
			},
			getData(){
				uni.showLoading()
				saleList(this.params).then(({data, total}) => {
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
		}
	}
</script>

<style lang="scss">
.tab{
	background-color: #fff;
	position: fixed;
	top:0;
	left: 0;
	right: 0;
	z-index: 1111;
	.wuc-tab-item{
		width: 50%;
		text-align: center;
		margin: 0;
		&.select-tab{
			color: $uni-color-primary;
			border-color: $uni-color-primary;
		}
	}
	
}
.list{
	.item{
		height: 150rpx;
		background-color: #fff;
		border-bottom: 1px solid $uni-border-color;
		padding: 0 24rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.left{
			font-size: 26rpx;
			color: $uni-text-color-grey;
			.time{
				margin-top: 10rpx;
			}
		}
		.right{
			font-size: 28rpx;
			text-align: right;
			.num{
				text-decoration: underline;
			}
			.price{
				color: $uni-color-error;
				margin-top: 20rpx;
			}
		}
	}
}
</style>
