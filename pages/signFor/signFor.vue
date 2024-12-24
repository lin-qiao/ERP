<template>
	<view class="sign-for">
		<uni-table ref="table" border stripe emptyText="暂无更多数据">
			<uni-tr>
				<uni-th width="70%" align="center">单号</uni-th>
				<uni-th width="30%" align="center">操作</uni-th>
			</uni-tr>
			<uni-tr v-for="(item, index) in tableData" :key="index">
				<uni-td>{{ item }}</uni-td>
				<uni-td>
					<view class="uni-group">
						<button class="uni-button" size="mini" type="warn" @click="handleDel(index)">
							删除
						</button>
					</view>
				</uni-td>
			</uni-tr>
		</uni-table>

		<view class="btns">
			<view class="btn" @click="handleSignFor">入库</view>
		</view>
	</view>
</template>
<script>
	// #ifdef APP
	import pda from "@/utils/pda.js";
	// #endif
	import {
		storageAdd
	} from "../../api/index.js";
	export default {
		data() {
			return {
				tableData: [],
			};
		},
		mounted() {
			pda.stopScan();
			pda.startScan();
		},
		destroyed() {
			pda.stopScan();
		},
		methods: {
			//对接pda扫码
			handlePdaScan(code) {
				console.log(code);
				if (!this.tableData.includes(code)) {
					this.tableData.push(code);
				}
			},
			handleDel(index) {
				console.log(index);
				this.tableData.splice(index, 1);
			},
			handleSignFor() {
				if (!this.tableData.length) {
					uni.showToast({
						title: "请先扫描快递单",
						icon: "none",
					});
					return;
				}
				uni.showLoading();
				storageAdd({
						expressList: this.tableData,
					})
					.then((res) => {
						uni.showToast({
							title: "签收成功",
							success: () => {
								this.tableData = [];
							},
						});
					})
					.finally(() => {
						uni.hideLoading();
					});
			},
		},
	};
</script>
<style lang="scss">
	.btns {
		display: flex;
		position: fixed;
		height: 88pxrpx;
		bottom: 0;
		left: 0;
		right: 0;

		.btn {
			flex: 1;
			line-height: 88rpx;
			font-size: 30rpx;
			text-align: center;
			color: #666;
			color: #fff;
			background-color: $uni-color-primary;
		}
	}
</style>