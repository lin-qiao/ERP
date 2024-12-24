<template>
	<view class="plr24 index">

		<uni-title type="h1" title="销售"></uni-title>
		<uni-grid :column="3" :showBorder="false" :square="false" @change="changeSale">
			<uni-grid-item :index="1">
				<view class="grid-item">
					<image src="../../static/1.png"></image>
					<text>销售单</text>
				</view>
			</uni-grid-item>
			<uni-grid-item :index="2">
				<view class="grid-item">
					<image src="../../static/2.png"></image>
					<text>销售历史</text>
				</view>
			</uni-grid-item>
			<uni-grid-item :index="3">
				<view class="grid-item no-right-border">
					<image src="../../static/3.png"></image>
					<text>销售退货单</text>
				</view>
			</uni-grid-item>
			<uni-grid-item :index="4">
				<view class="grid-item no-bottom-border">
					<image src="../../static/4.png"></image>
					<text>销售退货历史</text>
				</view>
			</uni-grid-item>
		</uni-grid>
		<uni-title type="h1" title="签收"></uni-title>
		<uni-grid :column="3" :showBorder="false" :square="false">
			<uni-grid-item :index="1">
				<view class="grid-item no-bottom-border" @click="handleSignFor">
					<image src="../../static/1.png"></image>
					<text>签收</text>
				</view>
			</uni-grid-item>
			<uni-grid-item :index="1">
				<view class="grid-item no-bottom-border" @click="handleSignForList">
					<image src="../../static/1.png"></image>
					<text>签收列表</text>
				</view>
			</uni-grid-item>
			<!-- 			<uni-grid-item :index="1">
						<view class="grid-item no-bottom-border" @click="handleTakeOver">
							<image src="../../static/1.png"></image>
							<text>入库</text>
						</view>
					</uni-grid-item> -->
		</uni-grid>
		<uni-title type="h1" title="采购"></uni-title>
		<uni-grid :column="3" :showBorder="false" :square="false" @change="changePurchase">
			<uni-grid-item :index="1">
				<view class="grid-item">
					<image src="../../static/5.png"></image>
					<text>采购单</text>
				</view>
			</uni-grid-item>
			<uni-grid-item :index="2">
				<view class="grid-item">
					<image src="../../static/6.png"></image>
					<text>采购历史</text>
				</view>
			</uni-grid-item>
			<uni-grid-item :index="3">
				<view class="grid-item no-right-border">
					<image src="../../static/7.png"></image>
					<text>采购退货单</text>
				</view>
			</uni-grid-item>
			<uni-grid-item :index="4">
				<view class="grid-item no-bottom-border">
					<image src="../../static/8.png"></image>
					<text>采购退货历史</text>
				</view>
			</uni-grid-item>
		</uni-grid>
		<!-- 		<uni-title type="h1" title="基础"></uni-title>
		<uni-grid :column="3" :showBorder="false" :square="false" @change="changeBase">
		    <uni-grid-item :index="1">
		        <view class="grid-item no-bottom-border">
		        	<image src="../../static/13.png"></image>
		        	<text>尺码管理</text>
		        </view>
		    </uni-grid-item>
		    <uni-grid-item :index="2">
		        <view class="grid-item no-bottom-border">
		        	<image src="../../static/14.png"></image>
		        	<text>品牌管理</text>
		        </view>
		    </uni-grid-item>
			<uni-grid-item :index="3">
			    <view class="grid-item no-right-border no-bottom-border">
			    	<image src="../../static/15.png"></image>
			    	<text>供应商管理</text>
			    </view>
			</uni-grid-item>
		</uni-grid> -->
		<uni-title type="h1" title="统计"></uni-title>
		<uni-grid :column="3" :showBorder="false" :square="false" @change="changeReport">
			<uni-grid-item :index="1">
				<view class="grid-item">
					<image src="../../static/9.png"></image>
					<text>销售报表</text>
				</view>
			</uni-grid-item>
			<uni-grid-item :index="2">
				<view class="grid-item">
					<image src="../../static/11.png"></image>
					<text>商品销售报表</text>
				</view>
			</uni-grid-item>
			<uni-grid-item :index="3">
				<view class="grid-item no-right-border">
					<image src="../../static/16.png"></image>
					<text>品牌销售报表</text>
				</view>
			</uni-grid-item>
			<uni-grid-item :index="4">
				<view class="grid-item no-bottom-border">
					<image src="../../static/10.png"></image>
					<text>采购报表</text>
				</view>
			</uni-grid-item>
		</uni-grid>
	</view>

</template>

<script>
	import {
		supplierList
	} from '../../api/index.js'
	export default {
		data() {
			return {}
		},
		onLoad() {
			this.getSupplierList()
		},
		methods: {
			/**
			 * @description 供应商列表
			 * @param 
			 * @return 
			 */
			getSupplierList() {
				uni.showLoading()
				supplierList({
					page: 1,
					size: 100
				}).then(res => {
					wx.setStorageSync('supplierList', res.data)
				}).finally(() => {
					uni.hideLoading()
				})
			},
			changeSale(e) {
				let {
					index
				} = e.detail;
				index = Number(index);
				let url, type;
				switch (index) {
					case 1:
						url = '/pages/sale/sale';
						type = 2;
						break;
					case 2:
						url = '/pages/saleList/saleList';
						type = 1;
						break;
					case 3:
						url = '/pages/saleReturn/saleReturn';
						type = 1;
						break;
					case 4:
						url = '/pages/saleReturnList/saleReturnList';
						type = 1;
						break;
				}
				console.log(url)
				if (type == 2) {
					uni.switchTab({
						url,
					})
				} else {
					uni.navigateTo({
						url,
					})
				}
			},
			changePurchase(e) {
				let {
					index
				} = e.detail;
				index = Number(index);
				let url, type;
				switch (index) {
					case 1:
						url = '/pages/purchase/purchase';
						type = 1;
						break;
					case 2:
						url = '/pages/purchaseList/purchaseList';
						type = 1;
						break;
					case 3:
						url = '/pages/purchaseReturn/purchaseReturn';
						type = 1;
						break;
					case 4:
						url = '/pages/purchaseReturnList/purchaseReturnList';
						type = 1;
						break;
				}
				if (type == 2) {
					uni.switchTab({
						url,
					})
				} else {
					uni.navigateTo({
						url,
					})
				}
			},
			changeReport(e) {
				let {
					index
				} = e.detail;
				index = Number(index);
				let url, type;
				switch (index) {
					case 1:
						url = '/pages/saleReport/saleReport';
						type = 1;
						break;
					case 2:
						url = '/pages/goodsSaleReport/goodsSaleReport';
						type = 1;
						break;
					case 3:
						url = '/pages/brandSaleReport/brandSaleReport';
						type = 1;
						break;
					case 4:
						url = '/pages/purchaseReport/purchaseReport';
						type = 1;
						break;
				}
				if (type == 2) {
					uni.switchTab({
						url,
					})
				} else {
					uni.navigateTo({
						url,
					})
				}
			},
			changeBase() {
				let {
					index
				} = e.detail;
				index = Number(index);
				let url;
				switch (index) {
					case 1:
						url = '/pages/saleReport/saleReport';
						break;
					case 2:
						url = '/pages/goodsSaleReport/goodsSaleReport';
						break;
					case 3:
						url = '/pages/purchaseReport/purchaseReport';
						break;
					case 3:
						url = '/pages/purchaseReport/purchaseReport';
						break;
				}
				uni.navigateTo({
					url,
				})
			},
			handleTakeOver() {
				uni.navigateTo({
					url: '/pages/takeOver/takeOver'
				})
			},
			handleSignFor() {
				uni.navigateTo({
					url: '/pages/signFor/signFor'
				})
			},
			handleSignForList() {
				uni.navigateTo({
					url: '/pages/signForList/signForList'
				})
			}
		}
	}
</script>

<style lang="scss">
	.index {
		min-height: 100vh;
		background-color: #fff;
	}

	.grid-item {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 30rpx 0;
		border-right: 1rpx solid $uni-border-color;
		border-bottom: 1rpx solid $uni-border-color;

		&.no-right-border {
			border-right: none;
		}

		&.no-bottom-border {
			border-bottom: none;
		}

		image {
			width: 60rpx;
			height: 60rpx;
		}

		text {
			font-size: 26rpx;
			margin-top: 15rpx;
			color: #333;
		}
	}
</style>