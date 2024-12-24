<template>
	<view class="container">
		<view class="top-wrap">
			<uni-nav-bar 
				backgroundColor="#01c2c3" 
				color="#fff"
				statusBar="true"
				left-icon="plusempty" 
				title="商品"
				@clickLeft="handleAdd">
			</uni-nav-bar>
			<uni-search-bar placeholder="货号/名称" @confirm="search" v-model="params.keywords"></uni-search-bar>
			<view class="stat">
				<view class="stat-item">
					<view class="con">{{total}} | {{totalNumber}}</view>
					<view class="text">商品 | 库存</view>
				</view>
				<view class="stat-item">
					<view class="con">￥{{bigNumberTransform(totalCostPrice)}}</view>
					<view class="text">库存成本</view>
				</view>
			</view>
			<view class="nav-list">
				<view :class="['nav-item', {'on': item.type != ''}]" v-for="(item, index) in navList" @click="handleNav(index)">
					<uni-icons v-if="item.type" :type="item.type == 'desc'? item.icon: item.selectIcon" size="12" ></uni-icons>
					<text>{{item.label}}</text>
				</view>
			</view>
		</view>
		<view class="goods">
			<mescroll-uni :fixed="false"  ref="mescrollRef" @init="mescrollInit"  @down="downCallback" :up="upOption" @up="upCallback">
				<uni-swipe-action class="goods-list">
					<uni-swipe-action-item  v-for="item in goodsList">
						<navigator :url="'../detail/detail?id=' + item.goodsId " class="goods-item" hover-class="none">
							<view class="img">
								<image :src="item.imgUrl"></image>
							</view>
							<view class="con">
								<view class="goods-tit">{{item.goodsName}}</view>
								<view class="goods-sn">{{item.goodsSn}}</view>
								<view class="goods-price">
									<view class="goods-price-item">
										<text class="number" v-if="item.totalNumber == 0">0.00</text>
										<text class="number" v-else>{{formatMoney(item.totalCostPrice / item.totalNumber )}}</text>
										<text class="text">采购均价</text>
									</view>
									<view class="goods-price-item">
										<text class="number">{{formatMoney(item.totalCostPrice)}}</text>
										<text class="text">总成本</text>
									</view>
									<view class="goods-price-item">
										<text class="number">{{item.totalNumber}}</text>
										<text class="text">库存量</text>
									</view>
								</view>
							</view>
						</navigator>
						<template v-slot:right>
							<view class="del-btn"  @click="handleEdit(item)">
								<image  src="../../static/edit2.png" alt=""></image>
							</view>
						</template>
					</uni-swipe-action-item>
						
					
				</uni-swipe-action>
			</mescroll-uni> 
		</view>
	</view>
</template>

<script>
	import { bigNumberTransform, formatMoney } from '../../utils/util.js'
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	import { getStockGoodsList, getStockStat } from '../../api/index.js'
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				navList: [
					{
						type: '',
						icon: '',
						selectIcon: '',
						name: 'createTime',
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
					order: 'createTime desc',
				},
				goodsList: [],
				total:0,
				totalNumber: 0,
				totalCostPrice: 0,
			}
		},
		onShow() {
			this.getStockStat()
		},
		onLoad() {
			uni.$on('isAdd', (data) => {
				this.reset()
			})
		},
		methods: {
			formatMoney(price){
				return formatMoney(price)
			},
			bigNumberTransform(num){
				return bigNumberTransform(num)
			},
			search(val){
				this.reset()
			},
			// 点击添加
			handleAdd(){
				uni.navigateTo({
					url: '/pages/goodsAdd/goodsAdd'
				})
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
					this.params.order = 'createTime desc';
					this.reset()
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
				this.reset()
			},
			//点击编辑
			handleEdit(obj){
				uni.setStorageSync('editGoods', {
					name: obj.goodsName,
					goodSn: obj.goodsSn,
					imgUrl: obj.imgUrl,
					brandId: obj.brandId,
					sizeIds: obj.sizeIds.split(',').map(item => Number(item)),
					stockInfos: obj.stockInfos,
					purchasePrice: obj.purchasePrice
				})
				uni.navigateTo({
					url: '/pages/goodsAdd/goodsAdd?id=' + obj.goodsId
				})
			},
			reset(){
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 0
				})
				this.params.page = 1;
				this.goodsList = []// 先置空列表,显示加载进度
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
			  * @description 获取统计数据
			  * @param 
			  * @return 
			  */
			getStockStat() {
				getStockStat().then(res => {
					this.totalCostPrice = res.data.costPriceTotal;
					this.totalNumber =  res.data.numberTotal;
				})
			}
		}
	}
</script>

<style lang="scss">
	.container{
		height: 100vh;
		display: flex;
		flex-direction: column;
	}
	.top-wrap {
		background-color: white;
	}
	.goods{
		min-height: 0;
		flex:1;
	}
	.uni-icons {
		color: inherit !important;
	}
	.stat{
		display: flex;
		height: 110rpx;
		.stat-item{
			width: 50%;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			.con{
				color: $uni-text-color;
				font-size: 32rpx;
			}
			.text{
				color: $uni-text-color-grey;
				font-size: 24rpx;
				margin-top: 5rpx;
			}
		}
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
	
	.goods-list{
		.goods-item{
			display: flex;
			border-bottom: 1rpx solid $uni-border-color;
			background-color: #fff;
			.img{
				display: flex;
				justify-content: center;
				align-items: center;
				width: 220rpx;
				
				image{
					width: 180rpx;
					height: 115rpx;
					background: url(../../static/empty.png) no-repeat;
					background-size: cover;
				}
			}
			.con{
				width: 530rpx;
				.goods-tit{
					padding: 10rpx 10rpx 0;
					line-height: 70rpx;
					width: 100%;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					font-size: 28rpx;
					color: #333;
					border-bottom: 1rpx dashed $uni-border-color;
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
					border-bottom: 1rpx dashed $uni-border-color;
				}
				.goods-price{
					display: flex;
					.goods-price-item{
						width: 33.33%;
						height: 100rpx;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						.number{
							font-size: 26rpx;
							color: $uni-color-error;
						}
						.text{
							font-size: 22rpx;
							margin-top: 5rpx;
							color: $uni-text-color-grey;
						}
					}
				}
			}
		}
	}
	.del-btn{
		width: 150rpx;
		height: 100%;
		background-color: $uni-color-primary;
		display: flex;
		justify-content: center;
		align-items: center;
		image{
			width:60rpx;
			height: 60rpx;
		}
	}
</style>
