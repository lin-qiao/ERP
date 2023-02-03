<template>
	<view>
		<uni-card class="select-goods" title="选择商品">
		    <view class="goods-list">
				<view class="goods-item" v-for="(item, index) in selectGoods" :key="item.goodsId">
					<view class="goods-info">
						<text>{{item.goodsName}}</text>
						<text>（{{item.goodsSn}}）</text>
						<image src="../../static/edit.png" @click="handleEdit(item)"></image>
						<image src="../../static/del.png" @click="handleDei(index)"></image>
					</view>
					<view class="goods-size-list">
						<view class="goods-size" v-for="subItem in item.sizeList" :key="subItem.sizeId">
							<text>{{subItem.sizeName}}</text>
							<view class="input">
								<view class="input-wrap">  
									<text>￥</text>
									<input type="digit"  v-model="subItem.price" @input="inputPrice"></input>
								</view>
							</view>
							<view class="input" @click="handleEdit(item)">
								<view class="input-wrap">
									<input type="number" disabled v-model="subItem.quantity"></input>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="goods-add" @click="handleAdd">
				<image src="../../static/add.png"></image>
				<text>添加商品</text>
			</view>
		</uni-card>
		<view class="bottom-nav">
			<view class="total">合计：{{totalNumber}} <text class="red">￥{{selectPrice.toFixed(2)}}</text></view>
			<view class="btn" @click="handleConfirmAll()">出售</view>
		</view>
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
						<uni-number-box :max="item.number" v-model="item.quantity"/>
					</view>
				</view>
				<view class="goods-nav">
					<view class="total">共{{selectNumber}}件</view>
					<view class="btn" @click="handleConfirm">确认</view>
				</view>
			</scroll-view>
		</uni-popup>
	</view>
</template>

<script>
	import { getGoodsStock, saleAdd } from '../../api/index.js'
	export default {
		data() {
			return {
				selectGoods: [],
				curGoods: {},
				stockList:[],
				noClick: false,
			}
		},
		onShow() {
			this.selectGoods = uni.getStorageSync('selectGoods') || [];
		},
		computed:{
			totalNumber(){
				return this.selectGoods.reduce((total, item) => {
					 return total +  item.sizeList.reduce((subTotal, subItem) => {
						return subTotal + Number(subItem.quantity)
					}, 0)
				}, 0)
			},
			selectPrice(){
				return this.selectGoods.reduce((total, item) => {
					 return total +  item.sizeList.reduce((subTotal, subItem) => {
						return ((subTotal * 100) + subItem.quantity * (subItem.price * 100)) / 100
					}, 0)
				}, 0)
			},
			selectNumber(){
				return this.stockList.reduce((total, item) => {
					 return total + Number(item.quantity)
				}, 0)
			}
		},
		methods: {
			/**
			 * @description 修改缓存价格
			 * @param 
			 * @return 
			 */
			inputPrice(){
				uni.setStorageSync('selectGoods', this.selectGoods)
			},
			handleAdd(){
				uni.navigateTo({
					url: '/pages/selectGoods/selectGoods?type=3'
				})
			},
			/**
			 * @description 获取库存
			 * @param 
			 * @return 
			 */
			
			getGoodsStock(id){
				uni.showLoading()
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
				 }).finally(() => {
					uni.hideLoading()
				})
			},
			/**
			  * @description 选择商品
			  * @param 
			  * @return 
			  */
			handleConfirm(){
				 const sizeList =  this.stockList.filter(item => item.quantity != 0).map(item => ({
					 sizeName: item.sizeName,
					 sizeId: item.sizeId,
					 quantity: item.quantity,
					 price: item.price
				 }));
				 this.selectGoods.forEach(item => {
					 if(item.goodsId == this.curGoods.goodsId){
						 item.sizeList = sizeList;
					 }
				 })
				
				this.$refs.popup.close();
			},
			/**
			  * @description 点击编辑
			  * @param 
			  * @return 
			  */
			handleEdit(obj){
				this.curGoods = obj;
				this.getGoodsStock(obj.goodsId);
				this.$refs.popup.open('bottom');
			},
			/**
			  * @description 点击编辑
			  * @param 
			  * @return 
			  */
			handleDei(index){
				this.selectGoods.splice(index, 1);
				uni.setStorageSync('selectGoods', this.selectGoods)
			},
			
			/**
			  * @description 点击出售
			  * @param 
			  * @return 
			  */
			handleConfirmAll(){
				const goods = this.selectGoods.filter(item => item.total > 0);
				if(!goods.length){
					uni.showToast({
						title: '请选择商品',
						icon: 'none'
					})
					return;
				}
				let arr = [];
				goods.forEach(item => {
					item.sizeList.forEach(subItem => {
						arr.push({
							goodsId: item.goodsId,
							sizeId: subItem.sizeId,
							quantity: subItem.quantity, 
							price: subItem.price
						})
					})
				})
				if(this.noClick) return;
				this.noClick = true;
				uni.showLoading()
				saleAdd({
					itemType: 1,
					goods: arr
				}).then(({data}) => {
					uni.removeStorageSync('selectGoods');
					uni.showToast({
						title: '出售成功',
						success:() => {
							setTimeout(() => {
								this.noClick = false;
								uni.navigateTo({
									url: '/pages/saleDetail/saleDetail?saleSn=' + data.saleSn
								})
							}, 1500)
						}
					})
				}).catch(() => {
					this.noClick = false;
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.select-goods{
		/deep/ .uni-card{
			margin: 0;
			.uni-card__content{
				padding: 0;
			}
		}
	}
	.goods-item{
		padding: 0 $uni-spacing-row-lg;
		.goods-info{
			padding: 15rpx 0;
			font-size: 24rpx;
			line-height: 1.5;
			word-break: break-all;
			color: #333;		
			border-bottom: 1rpx solid $uni-border-color;

			image{
				width: 30rpx;
				height: 30rpx;
				margin-left: 20rpx;
				vertical-align: middle;
			}
		}
		.goods-size-list{
			.goods-size{
				height: 80rpx;
				display: flex;
				align-items: center;
				border-bottom: 1rpx solid $uni-border-color;
				text{
					font-size: 28rpx;
					width: 33%;
					text-align: center;
				}
				.input{
					width: 33%;
					padding: 0 $uni-spacing-row-lg;
					.input-wrap{
						height: 60rpx;
						display: flex;
						font-size: 28rpx;
						align-items: center;
						border-bottom: 1rpx solid $uni-border-color;
					}
					input {
						font-size: 28rpx;
					}
				}
				
			}
		}
	}
	
	.goods-add{
		height: 200rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		image{
			width: 80rpx;
			height: 80rpx;
		}
		text{
			font-size: 28rpx;
			color: #333;
			margin-top: 20rpx;
		}
	}
	.bottom-nav{
		height: 88rpx;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		background-color: #fff;
		border-top: 1rpx solid $uni-border-color;
		.total{
			flex:1;
			font-size: 24rpx;
			line-height: 88rpx;
			padding-left: $uni-spacing-row-lg;
			.red{
				font-size: 30rpx;
				margin-left: 20rpx;
			}
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
	.goods-popup{
		max-height: 80vh;
		padding-bottom: 88rpx;
		.goods-item{
			padding: 0 $uni-spacing-row-lg;
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
		.goods-size{
			padding: 0 $uni-spacing-row-lg;
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
				padding-left: $uni-spacing-row-lg;
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
	}
	
</style>
