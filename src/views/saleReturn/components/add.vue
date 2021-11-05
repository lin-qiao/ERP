<template>
	<el-card>
		<template #header>
			<div class="card-header">
				<span>销售退货单</span>
			</div>
		</template>
		 <!-- 搜索 -->
		<el-form ref="queryForm" :inline="true">
			<!-- 列表 -->
			<el-table
				:data="tableData"
				show-summary
				:summary-method="getSummaries"
			>
				 <el-table-column
					align="center"
					type="index"
					width="50"
				>
				</el-table-column>
				<el-table-column 
					prop="goodsName"
					label="商品"
					align="center"
					min-width="200"
				>
					<template v-slot="{ row, $index }">
						<el-select
							style="width: 100%;"
							v-model="row.goodsInfo"
							value-key="goodSn"
							filterable
							remote
							reserve-keyword
							placeholder="请输入商品名称/货号"
							:remote-method="getGoodsList"
							:loading="loading"
							@change="changeGoods($index)"
						>
							<el-option
								v-for="item in goodsList"
								:key="item.goodSn"
								:label="item.name"
								:value="item"
								
							>
								{{item.name}} / {{item.goodSn}}
							</el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column 
					prop="goodsSn" 
					label="货号"  
					width="150" 
					align="center"
				>
				</el-table-column>
				<el-table-column 
					prop="sizeId" 
					label="尺码"  
					width="120"
					align="center"
				>
					<template v-slot="{ row, $index }">
						<el-select
							style="width: 100%;"
							v-model="row.sizeId" 
							@change="changeSize($index)"
						>
						    <el-option
								v-for="item in row.sizeList"
								:key="item.id"
								:label="item.sizeName"
								:value="item.id">
							</el-option>
						</el-select>
					</template>					
				</el-table-column>
				<el-table-column prop="quantity" label="数量" width="100"  align="center">
					<template v-slot="{ row }">
						<el-input-number
							style="width: 50px;"
							v-model="row.quantity"
							:controls="false"
							:min="1"
						>
						</el-input-number>
					</template>	
				</el-table-column>
				<el-table-column prop="price" label="单价" width="120"  align="center">
					<template v-slot="{ row }">
						<el-input-number
							style="width: 100px;"
							v-model="row.price" 
							:precision="2"
							:controls="false"
							:min="0"
							>
						</el-input-number>
					</template>	
				</el-table-column>
				<el-table-column prop="price" label="金额" width="80"  align="center">
					<template v-slot="{ row }">
						{{(row.price * row.quantity).toFixed(2)}}
					</template>	
				</el-table-column>
				 <el-table-column
				      fixed="right"
				      label="操作"
				      width="100"
					  align="center"
					>
				      <template  v-slot="{ row, $index }">
						  <div class="btn">
							  <i class="el-icon-plus" @click="handleAdd"></i>
							  <i class="el-icon-delete" @click="handleDel($index)"></i>
						  </div>
				      </template>
				    </el-table-column>
			</el-table>
			<div class="operation">
				<el-button type="primary" @click="onSubmit">退货</el-button>
			</div>
		</el-form>
	</el-card>
	<select-size
		v-if="visible"
		v-model:visible="visible"
		:goodsId="goodsId"
		type="add"
		@confirm="handleConfirmSize"
	>
	</select-size>
</template>

<script>
	import {
		ref, 
		reactive,
		onMounted,
		toRefs,
		nextTick,
		computed,
		watch,
		getCurrentInstance
	} from 'vue';
	import { useStore } from "vuex";
	import selectSize from '@/components/selectSize';
	import {tableDataList} from '@/utils/data';
	export default{
		components:{
			selectSize
		},
		props:{
			supplierList:{
				type: Array,
				default: []
			}
		},
		setup(props, { emit }){
			const { proxy } = getCurrentInstance();
			const store = useStore();
			
			const tableIndex = ref(null);
			const visible = ref(false);
			const goodsId = ref([]);
			const goodsInfo = ref(null);
			const goodsList = ref([]);
			const loading = ref(false);
			const tableData = ref(JSON.parse(JSON.stringify(tableDataList)));
			
			/**
			  * @description 远程搜索商品
			  * @param 
			  * @return 
			  */
			 const getGoodsList = async (name) => {
				 loading.value = true;
				 const { code, data } = await  VE_API.goods.goodsList({page:1, limit: 10, name});
				 if(code == 200){
				 	goodsList.value = data;
				 }
				 loading.value = false;
			 }
			 
			
			/**
			  * @description 选择的商品变化时
			  * @param 
			  * @return 
			  */
			const changeGoods = (index) => {
				tableIndex.value = index;
				const obj = tableData.value[index];
				obj.goodsName = obj.goodsInfo.name;
				obj.goodsSn = obj.goodsInfo.goodSn;
				obj.goodsId = obj.goodsInfo.id;
				obj.price = 0;
				obj.sizeList = obj.goodsInfo.sizeNames;
				goodsId.value = obj.goodsInfo.id;
				goodsInfo.value = obj.goodsInfo;
				visible.value = true;
			}
			 
			 /**
			   * @description 尺码发生变化
			   * @param 
			   * @return 
			   */
			const changeSize = (index) => {
				const obj = tableData.value[index];
				const hasSize = tableData.value.filter(item => item.goodsId == obj.goodsId && item.sizeId == obj.sizeId);
				if(hasSize.length >= 2){
					proxy.$confirm("已经存在相同颜色尺码的商品，是否合并数量为一条记录？", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "error"
					})
					.then(() => {
						tableData.value.forEach((item, i) => {
							if(item.goodsId == obj.goodsId && item.sizeId == obj.sizeId && i != index){
								item.quantity += obj.quantity
							}
						})
						tableData.value.splice(index, 1)
					})
					.catch(() => {
						proxy.$message({
							type: "info",
							message: "已取消合并"
						});
					});
					return;
				}
				obj.sizeName = obj.sizeList.filter(item => item.id == obj.sizeId)[0].sizeName
				
			}
			
			 /**
			   * @description 尺码选择完成
			   * @param 
			   * @return 
			   */
			  
			const handleConfirmSize = (arr) => {
				
				let list = [];

				arr.forEach(item => {
					// 是否已经选择过相同的尺码
					const hasSize = tableData.value.filter(obj => obj.goodsId == goodsInfo.value.id && obj.sizeId == item.sizeId);
					if(hasSize.length){
						hasSize[0].quantity += item.number;
						
					}else{
						list.push({
							goodsInfo: goodsInfo.value,
							goodsName: goodsInfo.value.name,
							goodsId: goodsInfo.value.id,
							goodsSn: goodsInfo.value.goodSn,
							sizeList: goodsInfo.value.sizeNames,
							sizeId: item.sizeId,
							sizeName: item.sizeName,
							quantity: item.number,
							price: 0,
						})
					}
				  })
				  tableData.value.splice(tableIndex.value, 1, ...list);
			  }
			
			/**
			  * @description 添加一行
			  * @param 
			  * @return 
			  */
			const handleAdd = () => {
				tableData.value.push({
					goodsInfo: null,
					goodsName: '',
					goodsId: '',
					goodsSn: '',
					sizeList:[],
					sizeId: '',
					sizeName: '',
					quantity: 1,
					price: 0,
				})
			}
			
			/**
			  * @description 删除一行
			  * @param 
			  * @return 
			  */
			const handleDel =  (index) => {
				tableData.value.splice(index, 1)
			}
			
			/**
			  * @description
			  * @param 
			  * @return 
			  */
			 
			const getSummaries = (param) =>  {
				const { columns, data } = param;
				const sums = [];
				columns.forEach((column, index) => {
				  if (index === 1) {
					sums[index] = '合计';
					return;
				  }
				  
				  if(index == 4 || index == 6){
						const values = data.map(item => {
							if(index == 4){
								if(!item.goodsInfo){
									return 0
								}else{
									return  Number(item[column.property])
								}
							}else{
								return Number(item.price * item.quantity)
							}
						});
						if (!values.every(value => isNaN(value))) {
							sums[index] = values.reduce((prev, curr) => {
								const value = Number(curr);
								if (!isNaN(value)) {
									return prev + curr;
								} else {
									return prev;
								}
							}, 0);
							if(index == 6){
								sums[index] = sums[index].toFixed(2)
							}
						} else {
							sums[index] = 'N/A';
						}
					}
				});
			
				return sums;
			}
			/**
			  * @description 点击采购
			  * @param 
			  * @return 
			  */
			const onSubmit = async () => {
				let goods = tableData.value.filter(item => !!item.goodsId);
				if(!goods.length){
					proxy.$message({
						type: 'warning',
						message: '请选择商品'
					})
					return;
				}
				goods = goods.map(item => ({
					goodsId: item.goodsId,
					sizeId: item.sizeId,
					quantity: item.quantity, 
					price: item.price
				}))
				const {code, data, message} = await VE_API.sale.saleAdd({
					itemType: 2,
					goods: goods
				});
				
				if (code == 200) {
					tableData.value = JSON.parse(JSON.stringify(tableDataList));
					emit('getData');
					emit('changeOrderSn', data.saleSn)
					proxy.$message({
						type: 'success',
						message: message
					})
				}
			}
			

			onMounted(async () => {
				await getGoodsList()
			})
			return {
				tableData,
				getGoodsList,
				loading,
				goodsList,
				changeGoods,
				changeSize,
				visible,
				goodsId,
				goodsInfo,
				handleConfirmSize,
				handleAdd,
				handleDel,
				onSubmit,
				getSummaries
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.card-header{
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.grey{
		color: #afafaf;
	}
	.btn{
		i{
			cursor: pointer;
			margin: 0 5px;
		}
	}
	.operation{
		text-align: center;
		margin-top: 20px;
	}
</style>
