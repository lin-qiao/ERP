<template>
	<view class="goods-add">
		<uni-nav-bar backgroundColor="#01c2c3" color="#fff" statusBar="true" :right-icon="!id? '': 'trash'"
			:title="!id? '添加商品': '修改商品'" @clickRight="handleDel">
		</uni-nav-bar>
		<view class="form">
			<uni-forms ref="form" :modelValue="formData" :rules="rules">
				<uni-forms-item label="搜索商品">
					<uni-easyinput style="width: 100%;" type="text" v-model="selectGoodsName" placeholder="请输入商品货号/名称搜索"
						@focus="handleSearch" />
				</uni-forms-item>
				<uni-forms-item required label="商品名称" name="name">
					<uni-easyinput style="width: 100%;" type="text" v-model="formData.name" placeholder="请输入名称" />
				</uni-forms-item>
				<uni-forms-item required label="商品货号" name="goodSn">
					<uni-easyinput style="width: 100%;" type="text" v-model="formData.goodSn" placeholder="请输入货号" />
				</uni-forms-item>
				<uni-forms-item label="商品图片" name="imgUrl">
					<uni-easyinput style="width: 100%;" type="text" v-model="formData.imgUrl" placeholder="请输入图片地址" />
				</uni-forms-item>
				<uni-forms-item label="图片预览">
					<image class="img" :src="formData.imgUrl"></image>
				</uni-forms-item>
				<uni-forms-item label="采购价" name="purchasePrice">
					<uni-easyinput style="width: 100%;" type="digit" v-model="formData.purchasePrice"
						placeholder="请输入采购价格" />
				</uni-forms-item>

				<uni-forms-item required label="商品品牌" name="brandId">
					<uni-data-picker style="width: 100%;" placeholder="请选择商品名牌" v-model="formData.brandId"
						:localdata="brandList"></uni-data-picker>
				</uni-forms-item>
				<uni-forms-item required label="商品尺码" name="sizeIds">
					<uni-data-checkbox multiple v-model="formData.sizeIds" :localdata="sizeList"
						@change="changeSizeIds" />
				</uni-forms-item>
				<uni-forms-item label="单品条码" name="codeList">
					<view class="code-cell" @click="handleCodeNumber">
						{{codeText}}
					</view>
				</uni-forms-item>
				<view class="btns">
					<view class="btn" @click="handleSubmit">{{!id? '添加': '修改'}}</view>
				</view>
			</uni-forms>
		</view>
		<uni-popup ref="popup" type="bottom" background-color="#fff">
			<scroll-view class="code-list" scroll-y>
				<view class="code-item" v-for="(item, index) in codeList" :key="item.sizeId">
					<view class="code-tit">{{item.sizeName}}</view>
					<uni-forms-item label="条码">
						<view class="code-con">
							<text class="code-id">{{item.codeNumber}}</text>
							<uni-icons class="code-icon" type="plusempty" size="28" color="#01c2c3"
								@click="handleScan(index)"></uni-icons>
						</view>
					</uni-forms-item>
				</view>
				<view class="btns">
					<view class="btn" @click="$refs.popup.close()">确认</view>
				</view>
			</scroll-view>
		</uni-popup>
		<!-- 条码输入框 -->
		<uni-popup ref="inputDialog" type="dialog">
			<uni-popup-dialog ref="inputClose" mode="input" title="扫码条码" placeholder="请扫码条码"
				@focus="() => uni.hideKeyboard()" @confirm="handleInputConfirm"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>



<script>
	import {
		getSizeList,
		getBrandList,
		goodsAdd,
		goodsUpdate,
		goodsDelete
	} from '../../api/index.js'
	export default {
		data() {
			return {
				id: null,
				sizeList: [],
				brandList: [],
				codeList: [],
				currentCodeIndex: null,
				selectGoodsName: '',
				formData: {
					name: '',
					goodSn: '',
					imgUrl: '',
					brandId: '',
					sizeIds: [],
					purchasePrice: '',
				},
				rules: {
					// 对name字段进行必填验证
					name: {
						rules: [{
							required: true,
							errorMessage: '请输入商品名称',
						}, ]
					},
					goodSn: {
						rules: [{
							required: true,
							errorMessage: '请输入商品货号',
						}, ]
					},
					brandId: {
						rules: [{
							required: true,
							errorMessage: '请选择品牌名称',
						}, ]
					},
					sizeIds: {
						rules: [{
							required: true,
							errorMessage: '请选择商品尺码',
						}, ]
					}
				}
			}
		},
		onLoad(options) {
			if (options.id) {
				this.id = options.id;

				const obj = uni.getStorageSync('editGoods');
				this.formData = obj;
				this.codeList = this.formData.stockInfos.map(item => ({
					sizeId: item.sizeId,
					sizeName: item.sizeName,
					codeNumber: item.codeNumber
				}))
			}
			this.getBrandList()
			this.getSizeList()

			uni.$on('selectGoods', (data) => {
				this.selectGoodsName = data.title;
				this.formData.name = data.title;
				this.formData.goodSn = data.articleNumber;
				this.formData.imgUrl = data.logoUrl;
			})

		},

		computed: {
			codeText() {
				const num = this.codeList.filter(item => item.codeNumber);
				return num.length ? `${num.length}个单品已设置` : '未设置'
			}
		},
		methods: {
			handleSearch() {
				uni.hideKeyboard();
				uni.navigateTo({
					url: '/pages/goodsAddSearch/goodsAddSearch'
				})
			},
			handleDel() {
				uni.showModal({
					title: '提示',
					content: '你确定要删除该商品？',
					success: (res) => {
						if (res.confirm) {
							this.goodsDelete()
						}
					}
				});
			},
			//删除商品
			goodsDelete() {
				uni.showLoading()
				goodsDelete({
					id: this.id
				}).then(res => {
					uni.showToast({
						title: '删除商品成功',
						success: () => {
							setTimeout(() => {
								uni.navigateBack();
								uni.$emit('isAdd');
							}, 1500)
						}
					})
				}).finally(res => {
					uni.hideLoading()
				})
			},
			getBrandList() {
				getBrandList({
					page: 1,
					size: 100
				}).then(res => {
					this.brandList = res.data.map(item => ({
						text: item.brand_name,
						value: item.id
					}));;
				})
			},
			getSizeList() {
				getSizeList({
					page: 1,
					size: 100
				}).then(res => {
					this.sizeList = res.data.map(item => ({
						text: item.size_name,
						value: item.id
					}));
					if (!this.id) {
						this.formData.sizeIds = [this.sizeList[0].value];
						this.codeList = [{
							sizeId: this.sizeList[0].value,
							sizeName: this.sizeList[0].text,
							codeNumber: ''
						}]
					}
				})
			},
			handleCodeNumber() {
				if (!this.formData.sizeIds.length) {
					uni.showToast({
						icon: 'none',
						title: '请选择尺码',
					})
					return;
				}
				this.$refs.popup.open('bottom');
			},
			changeSizeIds(val) {
				const list = [];
				val.detail.data.forEach(item => {
					const find = this.codeList.find(subitem => subitem.sizeId == item.value)
					list.push({
						sizeId: item.value,
						sizeName: item.text,
						codeNumber: find ? find.codeNumber : '',
					})
				})
				this.codeList = list;
			},
			handleInputConfirm(val) {
				const list = this.codeList[this.currentCodeIndex].codeNumber ? this.codeList[this.currentCodeIndex].codeNumber.split(',') : [];
				console.log(list)
				if (!list.includes(val)) {
					list.push(val)
				}
				this.codeList[this.currentCodeIndex].codeNumber = list.join(',');
			},
			handleScan(index) {
				this.currentCodeIndex = index;
				this.$refs.inputDialog.open();
			},
			handleSubmit() {
				this.$refs.form.validate().then(res => {
					if (this.id) {
						uni.showLoading()
						goodsUpdate({
							id: this.id,
							...this.formData,
							purchasePrice: this.formData.purchasePrice || 0,
							sizeIds: this.formData.sizeIds.join(),
							codeList: this.codeList
						}).then(res => {
							uni.showToast({
								title: '修改成功',
								success: () => {
									setTimeout(() => {
										uni.navigateBack();
										uni.$emit('isAdd');
									}, 1500)
								}
							})
						}).finally(() => {
							uni.hideLoading()
						})
					} else {
						uni.showLoading()
						goodsAdd({
							...this.formData,
							purchasePrice: this.formData.purchasePrice || 0,
							sizeIds: this.formData.sizeIds.join()
						}).then(res => {
							uni.showToast({
								title: '添加成功',
								success: () => {
									setTimeout(() => {
										uni.navigateBack();
										uni.$emit('isAdd');
									}, 1500)
								}
							})
						}).finally(() => {
							uni.hideLoading()
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.goods-add {
		height: 100vh;

	}

	.form {
		box-sizing: border-box;
		padding: 30rpx $uni-spacing-row-lg 118rpx;
		background-color: #fff;
	}

	.img {
		width: 200rpx;
		height: 128rpx;
		background: url(../../static/empty.png) no-repeat;
		background-size: cover;
	}

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
			background-color: $uni-color-primary;
			font-size: 30rpx;
			color: #fff;
			text-align: center;

			&.del {
				background-color: $uni-color-error;
			}
		}
	}

	.code-cell {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
	}

	.code-list {
		max-height: 80vh;
		padding: $uni-spacing-row-lg;
		width: 100%;
		box-sizing: border-box;
		padding-bottom: 88rpx;
	}

	.code-con {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.code-id {
			flex: 1;
			width: 0;
			word-break: break-all;
		}

		.code-icon {
			margin-left: 10rpx;
		}
	}

	.con-tit {
		padding: 10rpx 0;
	}
</style>