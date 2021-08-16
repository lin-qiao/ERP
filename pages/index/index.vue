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
		<uni-title type="h1" title="统计"></uni-title>
		<uni-grid :column="3" :showBorder="false" :square="false" @change="changeReport">
		    <uni-grid-item :index="1">
				<view class="grid-item no-bottom-border">
					<image src="../../static/9.png"></image>
					<text>销售报表</text>
				</view>
		    </uni-grid-item>
		    <uni-grid-item :index="2">
		        <view class="grid-item no-bottom-border">
		        	<image src="../../static/10.png"></image>
		        	<text>采购报表</text>
		        </view>
		    </uni-grid-item>
		</uni-grid>
	</view>
	
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		onLoad() {
		},
		methods: {
			changeSale(e){
				let { index } = e.detail;
				index = Number(index);
				let url,type;
				switch (index){
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
				if(type == 2){
					uni.switchTab({
						url,
					})
				}else{
					uni.navigateTo({
						url,
					})
				}
			},
			changePurchase(e){
				let { index } = e.detail;
				index = Number(index);
				let url,type;
				switch (index){
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
				if(type == 2){
					uni.switchTab({
						url,
					})
				}else{
					uni.navigateTo({
						url,
					})
				}
			},
			changeReport(e){
				let { index } = e.detail;
				index = Number(index);
				let url,type;
				switch (index){
					case 1:
						url = '/pages/saleReport/saleReport';
						type = 1;
						break;
					case 2:
						url = '/pages/purchaseReport/purchaseReport';
						type = 1;
						break;
				}
				if(type == 2){
					uni.switchTab({
						url,
					})
				}else{
					uni.navigateTo({
						url,
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.index{
		height: 100vh;
		background-color: #fff;
	}
	.grid-item{
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 30rpx 0;
		border-right: 1rpx solid $uni-border-color;
		border-bottom: 1rpx solid $uni-border-color;
		&.no-right-border{
			border-right: none;
		}
		&.no-bottom-border{
			border-bottom: none;
		}
		image{
			width: 60rpx;
			height: 60rpx;
		}
		text{
			font-size: 26rpx;
			margin-top: 15rpx;
			color: #333;
		}
	}
</style>
