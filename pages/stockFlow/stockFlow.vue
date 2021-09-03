<template>
	<view>
		<view class="nav">
			<view class="btn" @click="handleShowScreen">
				<text>筛选</text>
				<image src="../../static/shaixuan.png"></image>
			</view>
		</view>
		<uni-drawer ref="drawer" mode="left" :width="600">
			<view class="screen-list">
				<view class="screen-item">
					<uni-title type="h3" title="商品尺码"></uni-title>
					<view class="size-list">
						<view :class="['size-item', {'on' : item.sizeId == params.sizeId}]"  v-for="item in sizeList" :key="item.sizeId" @click="handleSelectSize(item.sizeId)">
							{{item.sizeName}}
						</view>
					</view>
				</view>
				<view class="screen-item">
					<uni-title type="h3" title="日期"></uni-title>
					<uni-datetime-picker v-model="createTime" type="daterange" rangeSeparator="至" @change="changeCreateTime" />
				</view>
				<view class="btns">
					<view class="reset" @click="handleReset">重置</view>
					<view class="submit" @click="handleSubmit">确定</view> 
				</view>
			</view>
		</uni-drawer>
		<mescroll-body top="80" ref="mescrollRef" @init="mescrollInit" @down="downCallback" :up="upOption"
			@up="upCallback">
			<view class="flow-list" v-for="item in data">
				<view class="flow-item">
					<view class="flow-con">
						<text>发生数量：{{[3,4].includes(item.flowType)? -item.number: item.number}}</text>
						<text>剩余数量：{{item.numberStored}}</text>
					</view>
					<view class="flow-con">
						<text>尺码 - {{item.sizeName}}</text>
					</view>
					<view class="flow-con">
						<view class="name-tag">
							<uni-tag v-if="item.flowType == 1" text="采购" type="error" :circle="true" size="small">
							</uni-tag>
							<uni-tag v-else-if="item.flowType == 2" text="采购退货" type="success" :circle="true"
								size="small"></uni-tag>
							<uni-tag v-else-if="item.flowType == 3" text="销售" type="success" :circle="true"
								size="small"></uni-tag>
							<uni-tag v-else text="销售退货" type="error" :circle="true" size="small"></uni-tag>
						</view>
					</view>
					<view class="detail-con">
						<text>单据：{{item.businessSn}}</text>
						<text>{{dataFormat(item.createTime, 'yyyy-MM-dd hh:mm')}}</text>
					</view>
					<view class="detail-con">
						<text>业务单价：{{formatMoney(item.businessPrice)}}</text>
						<text>库存成本单价:{{formatMoney(item.costPrice)}}</text>
					</view>
					<view class="detail-con">
						<text>剩余库存成本：{{formatMoney(item.totalPrice)}}</text>
					</view>
				</view>
			</view>
		</mescroll-body>

	</view>
</template>

<script>
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	import {
		businessFlowList
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
					goodsId: '',
					sizeId: '',
					createTimeBegin: '',
					createTimeEnd: '',
					page: 1,
					size: 10,
				},
				createTime: [],
				sizeList:[],
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
		onLoad(option) {
			if (option.id) {
				this.params.goodsId = option.id;
			}
			this.sizeList = wx.getStorageSync('stockSizeList') || [];
		},
		methods: {
			dataFormat(data, format) {
				return dataFormat(data, format)
			},
			formatMoney(price) {
				return formatMoney(price)
			},
			handleShowScreen(){
				this.$refs.drawer.open();
			},
			handleSelectSize(sizeId){
				this.params.sizeId = sizeId;
			},
			handleReset(){
				this.params.sizeId = '';
				this.params.createTimeBegin = '';
				this.params.createTimeEnd = '';
			},
			handleSubmit(){
				this.$refs.drawer.close();
				this.reset();
			},
			changeCreateTime(arr){
				this.params.createTimeBegin = arr[0] + ' 00:00:00';
				this.params.createTimeEnd = arr[1] + ' 23:59:59';
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
				this.data = []
				this.mescroll.resetUpScroll()
			},
			getData() {
				uni.showLoading()
				businessFlowList(this.params).then(({
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

<style lang="scss" scoped>
	.nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 80rpx;
		background-color: #fff;
		padding: 0 $uni-spacing-row-lg;
		border-bottom: 1px solid $uni-border-color;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1111111;

		.btn {
			display: flex;
			justify-content: center;
			align-items: center;

			text {
				font-size: 28rpx;
			}

			image {
				margin-left: 5rpx;
				width: 30rpx;
				height: 30rpx;
			}
		}
	}

	.flow-list {
		.flow-item {
			border-bottom: 1px solid $uni-border-color;
			background-color: #fff;
			padding: $uni-spacing-row-lg;

			.flow-con {
				display: flex;
				font-size: 26rpx;
				padding: 5rpx 0;
				justify-content: space-between;
				color: #333;
			}

			.detail-con {
				display: flex;
				font-size: 24rpx;
				padding: 5rpx 0;
				justify-content: space-between;
				color: #666;
			}
		}
	}
	.screen-list{
		height: 100vh;
		padding: 80rpx $uni-spacing-row-lg 0;
		box-sizing: border-box;
		position: relative;
		.size-list{
			display: flex;
			flex-wrap: wrap;
			
			.size-item{
				margin-right: 15rpx;
				margin-bottom: 15rpx;
				height: 55rpx;
				line-height: 55rpx;
				text-align: center;
				width: 175rpx;
				background-color: #F8F8FA;
				font-size: 26rpx;
				color: #333;
				border-radius: 5rpx;
				&:nth-child(3n){
					margin-right: 0;
				}
				&.on{
					background-color: $uni-color-primary;
					color: #fff;
				}
				
			}
		}
		.btns{
			position: absolute;
			bottom: $uni-spacing-row-lg;
			left: $uni-spacing-row-lg;
			right: $uni-spacing-row-lg;
			height: 80rpx;
			display: flex;
			.reset{
				flex-grow: 1;
				height: 80rpx;
				line-height: 80rpx;
				text-align: center;
				box-sizing: border-box;
				border: 1px solid $uni-border-color;
				border-radius: 5rpx;
				color: #333;
				font-size: 28rpx;
			}
			.submit{
				flex-grow: 2;
				height: 80rpx;
				line-height: 80rpx;
				text-align: center;
				box-sizing: border-box;
				margin-left: 15rpx;
				background-color: $uni-color-primary;
				border-radius: 5rpx;
				color: #fff;
				font-size: 28rpx;
			}
		}
	}
	
	
</style>
