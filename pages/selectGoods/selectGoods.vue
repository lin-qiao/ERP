<template>
	<view class="container">
		<view class="top-wrap">
			<uni-search-bar placeholder="货号/名称" @confirm="search" v-model="params.keywords"></uni-search-bar>
			<view class="nav-list">
				<view :class="['nav-item', {'on': item.type != ''}]" v-for="(item, index) in navList" :key="index" @click="handleNav(index)">
					<uni-icons v-if="item.type" :type="item.type == 'desc'? item.icon: item.selectIcon" size="12" ></uni-icons>
					<text>{{item.label}}</text>
				</view>
			</view>
		</view>
		<mescroll-body ref="mescrollRef" @init="mescrollInit" top="166" @down="downCallback" :up="upOption" @up="upCallback">
			<view class="goods-list">
				<view class="goods-item" v-for="item in goodsList" :key="item.goodsId"  hover-class="none" @click="handleAdd(item)">
					<view class="img">
						<image :src="item.imgUrl" mode="widthFix"></image>
						<view class="number" v-if="item.total!= 0">{{item.total}}</view>
					</view>
					<view class="con">
						<view class="goods-tit">{{item.goodsName}}</view>
						<view class="goods-sn">{{item.goodsSn}}</view>
						<view class="goods-price" v-if="item.totalNumber == 0">0.00</view>
						<view class="goods-price" v-else>{{formatMoney(item.totalCostPrice / item.totalNumber )}}</view>
					</view>
				</view>
			</view>
		</mescroll-body> 
		<uni-popup ref="popup" type="bottom" background-color="#fff">
			<scroll-view class="goods-popup" scroll-y>
				<view class="goods-item">
					<view class="img">
						<image :src="curGoods.imgUrl" mode="widthFix"></image>
					</view>
					<view class="con">
						<view class="goods-tit">{{curGoods.goodsName}}</view>
						<view class="goods-sn">{{curGoods.goodsSn}}</view>
					</view>
				</view>
				<view class="goods-size">
					<view class="size-nav">
						<text>尺码</text>
						<text>库存</text>
					</view>
					<view class="size-item" v-for="item in stockList" :key="item.sizeId">
						<text>{{item.sizeName}}</text>
						<text>{{item.number}}</text>
						<uni-number-box v-model="item.quantity"/>
					</view>
				</view>
				<view class="goods-nav">
					<view class="total">共{{selectNumber}}件</view>
					<view class="btn" @click="handleConfirm">确认</view>
				</view>
			</scroll-view>
		</uni-popup>
		<view class="fixed goods-nav">
			<view class="total">已选择{{totalNumber}}件</view>
			<view class="btn" @click="handleConfirmAll">选好了</view>
		</view>
	</view>
</template>

<script>
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	import { getStockGoodsList, getGoodsStock } from '../../api/index.js'
	import { formatMoney } from '../../utils/util.js'
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				navList: [
					{
						type: '',
						icon: '',
						selectIcon: '',
						name: '',
						label: '默认'
					},
					{
						type: '',
						icon: 'arrowthindown',
						selectIcon: 'arrowthinup',
						name: 'totalCostPrice',
						label: '总成本'
					},
					{
						type: '',
						icon: 'arrowthindown',
						name: 'totalNumber',
						selectIcon: 'arrowthinup',
						label: '库存量'
					}
				],
				upOption:{
					
					empty:{
						tip: '~ 搜索无数据 ~', // 提示
						btnText: '去看看'
					}
				},
				params:{
					page: 1,
					size: 10,
					keywords: '',
					order: '',
				},
				goodsList: [],
				total:0,
				curGoods: {},
				stockList: [],
			}
		},
		computed:{
			totalNumber(){
				return this.goodsList.reduce((total, item) => {
					return total +item.total
				}, 0)
			},
			selectNumber(){
				return this.stockList.reduce((total, item) => {
					return total + Number(item.quantity)
				}, 0)
			}
		},
		methods: {
			formatMoney(price){
				return formatMoney(price)
			},
			search(val){
				this.getData()
			},
			/**
			  * @description 点击tab
			  * @param 
			  * @return 
			  */
			handleNav(index){
				this.navList.forEach((item, i) => {
					if(index != i){
						item.type = '';
					}
				})
				const obj = this.navList[index];
				if(index == 0){
					obj.type = 'desc';
					this.params.order = '';
					this.getData();
					return;
				}
				
				
				if(obj.type == ''){
					obj.type = 'desc';
				}
				else if(obj.type == 'desc'){
					obj.type = 'asc';
				}
				else if(obj.type == 'asc'){
					obj.type = 'desc';
				}
				this.params.order = obj.name + ' ' + obj.type;
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 0
				})
				this.params.page = 1;
				this.goods = []// 先置空列表,显示加载进度
				this.mescroll.resetUpScroll() // 再刷新列表数据
			},
			/**
			  * @description 获取数据
			  * @param 
			  * @return 
			  */
			getData(){
				getStockGoodsList(this.params).then(({data, total}) => {
					this.total = total;
					this.mescroll.endBySize(data.length, total);
					if(this.params.page == 1) this.goodsList = []; 
					const selectGoods = wx.getStorageSync('selectGoods') ||  [];
					data.forEach(item => {
						const filter = selectGoods.filter(obj => obj.goodsId == item.goodsId);
						if(filter.length){
							item.total = filter[0].total;
							item.sizeList = filter[0].sizeList;
						}else{
							item.total = 0;
							item.sizeList = [];
						}
					})
					this.goodsList = this.goodsList.concat(data); 
				})
				.catch(()=>{
					this.mescroll.endErr();
				})
			},
			
			upCallback(page) {
				this.params.page = page.num;
				this.params.size = page.size;
				this.getData()
			},
			/**
			  * @description 点击商品
			  * @param 
			  * @return 
			  */
			 
			 handleAdd(item){
				 this.$refs.popup.open('bottom');
				 this.curGoods = item;
				 this.getGoodsStock(item.goodsId);
			 },
			 /**
			  * @description 获取库存
			  * @param 
			  * @return 
			  */
			 
			 getGoodsStock(id){
				 getGoodsStock({goodsId: id}).then(res => {
					 const sizeList = this.curGoods.sizeList;
					 res.data.forEach(item => {
						 const filter = sizeList.filter(obj => obj.sizeId == item.sizeId);
						 if(filter.length){
							 item.quantity = filter[0].quantity;
							 item. price = filter[0].price;
						 }else{
							 item.quantity = 0;
							 item. price = 0;
						 }
					 })
					this.stockList = res.data;
				 })
			 },
			 /**
			   * @description 选择商品
			   * @param 
			   * @return 
			   */
			 handleConfirm(){
				if(this.curGoods.selectNumber == 0){
					this.$refs.popup.close();
					return;
				}
				 const sizeList =  this.stockList.filter(item => item.quantity != 0).map(item => ({
					 sizeName: item.sizeName,
					 sizeId: item.sizeId,
					 quantity: item.quantity,
					 price: 0
				 }));
				 this.goodsList.forEach(item => {
					 if(item.goodsId == this.curGoods.goodsId){
						 item.total = this.selectNumber;
						 item.sizeList = sizeList;
					 }
				 })
				 
				
				this.$refs.popup.close();
			 },
			 /**
			   * @description 提交全部商品
			   * @param 
			   * @return 
			   */
			 handleConfirmAll(){
				 const selectGoods = this.goodsList.filter(item => item.total != 0);
				 wx.setStorageSync('selectGoods', selectGoods)
				 uni.navigateBack()
			 }
		}
	}
</script>

<style lang="scss">
	.top-wrap {
		    z-index: 1;
		    position: fixed;
		    top: --window-top;
		    left: 0;
		    width: 100%;
		    height: 166rpx;
		    background-color: white;
	}
	.uni-icons {
		color: inherit !important;
	}
	.nav-list{
		height: 70rpx;
		display: flex;
		border-top: 1rpx solid $uni-border-color;
		border-bottom: 1rpx solid $uni-border-color;
		.nav-item{
			width: 33.33%;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 28rpx;
			color: $uni-text-color;
			&.on{
				color: $uni-color-primary;
			}
		}
	}
	
	.goods-item{
		padding: 0 24rpx;
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
			}
		}
		.con{
			width: 516rpx;
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
	.goods-popup{
		max-height: 80vh;
		padding-bottom: 88rpx;
	}
	.goods-size{
		padding: 0 24rpx;
		.size-nav{
			height: 100rpx;
			display: flex;
			border-bottom: 1px solid $uni-border-color;
			text{
				line-height: 100rpx;
				width: 30%;
				font-size: 28rpx;
				color: #666;
			}
		}
		.size-item{
			height: 100rpx;
			display: flex;
			align-items: center;
			border-bottom: 1px solid $uni-border-color;
			text{
				line-height: 100rpx;
				width: 30%;
				font-size: 28rpx;
				color: #333;
			}
			/deep/ .uni-numbox__value{
				font-size: 28rpx !important;
			}
		}
	}
	.goods-nav{
		height: 88rpx;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		background-color: #fff;
		border-top: 1rpx solid $uni-border-color;
		z-index: 1111;
		.total{
			flex:1;
			font-size: 28rpx;
			line-height: 88rpx;
			padding-left: 24rpx;
		}
		.btn{
			width: 150rpx;
			height: 88rpx;
			line-height: 88rpx;
			text-align: center;
			background-color: $uni-color-primary;
			color: #fff;
			font-size: 28rpx;
		}
	}
	.fixed{
		z-index: 11;
	}
</style>
