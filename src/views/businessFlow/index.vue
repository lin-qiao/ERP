<template>
	<!-- 搜索 -->
	<el-form ref="queryForm" :inline="true" :model="params">
	    <el-form-item label="商品：" prop="goodSn">
	        <el-select
	            v-model="goodsInfo"
	    		value-key="id"
	            filterable
	            remote
				clearable
	            reserve-keyword
	            placeholder="请输入商品名称/货号"
	            :remote-method="getGoodsList"
	            :loading="loading"
				@change="changeGoodsInfo"
			> 
	            <el-option
	              v-for="item in goodsList"
	              :key="item.articleNumber"
	              :label="`${item.name} / ${item.goodSn}`"
	              :value="item">
	    		  {{item.name}} / {{item.goodSn}}
	            </el-option>
	          </el-select>
	    </el-form-item>
		<el-form-item label="尺码：" prop="sizeId">
		    <el-select 
				clearable
				v-model="sizeId" 
				placeholder="请选择尺码"
				@change="onSubmit(params, getDataList)"
			>
		        <el-option
					v-for="item in sizeList"
					:key="item.id"
					:label="item.sizeName"
					:value="item.id">
				</el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="日期：" prop="createTime" >
			<el-date-picker
				clearable
				v-model="createTime"
				type="daterange"
				value-format="YYYY-MM-DD"
				unlink-panels
				range-separator="至"
				start-placeholder="开始日期"
				end-placeholder="结束日期"
				:shortcuts="shortcuts"
				@change="changeCreateTime"
			>
			</el-date-picker>
		</el-form-item>
		
	    <el-form-item>
	        <el-button
	            type="primary"
	            @click="onSubmit(params, getDataList)"
	            >搜索</el-button
	        
	        >
	    </el-form-item>
	</el-form>
	<!-- 列表 -->
	<table-com
		class="table"
		:columns="tableColumn"
		:data="tableData"
		style="width: 100%"
		:max-height="ve_max_height"
	>
	</table-com>
	<!-- 分页 -->
	<el-pagination
		ref="pagination"
		background
		@size-change="val => handleSizeChange(val, params, getDataList)"
		@current-change="val => handleCurrentChange(val, params, getDataList)"
		:hide-on-single-page="total <= size ? true : false"
		layout="total, sizes, prev, pager, next, jumper"
		:page-sizes="[10, 20, 50, 100]"
		:current-page="page"
		:page-size="size"
		:total="total"
	>
	</el-pagination>

</template>

<script>
	import { 
		ref, 
		reactive,
		onMounted,
		toRefs,
		getCurrentInstance,  //获取当前组件实例
	} from 'vue';
	import { useRouter } from "vue-router";
	//*导入公共查询方法
	import {
		onSubmit,
		resetForm,
	    handleSizeChange,
	    handleCurrentChange,
	    maxHeight
	} from "@/views/layoutpages/common";
	import {
		formatMoney
	} from '@/utils/index';
	export default {
		setup(){		
			const router = useRouter();
			const ve_max_height = ref(0);
			const pagination = ref(null);
			const queryForm = ref(null);
			const toolBar = ref(null);
		
			const loading = ref(false);
			const goodsList = ref([]);
			const sizeList = ref([]);
			const tableColumn = ref([
				{
					props: { prop: "createTime", label: "业务时间", minWidth: '160px'},
					default:({row}) => {
						return new Date(row.createTime).Format('yyyy-MM-dd hh:mm:ss')
					}
				},
				{
					props: { prop: "goodsSn", label: "货号", minWidth: '150px'},
					default:({row}) => {
						return row.goodsSn
					}
				},
				{
					props: { prop: "goodsName", label: "名称", minWidth: '280px'},
					default:({row}) => {
						return row.goodsName
					}
				},
				{
					props: { prop: "sizeName", label: "尺码" , width: '80px'},
					default:({row}) => {
						return row.sizeName
					}
				},
				{
					props: { prop: "totalNumber", label: "业务类型", width: '120px'},
					default:({row}) => {
						let text;
						switch (row.flowType){
							case 1:
								text = '采购单'
								break; 
							case 2:
								text = '采购退货单'
								break; 
							case 3:
								text = '销售单'
								break; 
							case 4:
								text = '销售退货单'
								break; 
						}
						return text
					}
				},
				{
					props: { prop: "businessSn", label: "业务单号", width: '180px'},
					default:({row}) => {
						
						return (
							<el-link type="primary" href="javascript:;" onClick={() => toBusiness(row.businessSn)}>{row.businessSn}</el-link>
						)
					}
				},
				{
					props: { prop: "number", label: "库存增加数量", width: '110px'},
				},
				{
					props: { prop: "numberStored", label: "剩余数量", width: '100px'},
				},
				{
					props: { prop: "businessPrice", label: "业务单价", width: "100px"},
					default: (scope) => {
						return  (
							formatMoney(scope.row.businessPrice)
						)
					}
				}, 
				{
					props: { prop: "totalBusinessPrice", label: "业务总价", width: "100px"},
					default: (scope) => {
						return  (
							formatMoney(scope.row.totalBusinessPrice)
						)
					}
				}, 
				{
					props: { prop: "costPrice", label: "库存成本均价", width: "120px"},
					default: (scope) => {
						return  (
							formatMoney(scope.row.costPrice)
						)
					}
				}, 
				{
					props: { prop: "totalPrice", label: "剩余库存成本", width: "120px"},
					default: (scope) => {
						return  (
							formatMoney(scope.row.totalPrice)
						)
					}
				}
			]);
			const shortcuts = ref([{
				text: '最近一周',
				value: (() => {
					const end = new Date()
					const start = new Date()
					start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
					return [start, end]
				})(),
			}, {
				text: '最近一个月',
				value: (() => {
					const end = new Date()
					const start = new Date()
					start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
					return [start, end]
				})(),
			}, {
				text: '最近三个月',
				value: (() => {
					const end = new Date()
					const start = new Date()
					start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
					return [start, end]
				})(),
			}])
			
			const goodsInfo = ref(null);
			const createTime = ref([]);
			/* 请求参数 */
			const params = reactive({
				goodsId: '',
				sizeId: '',
				createTimeBegin:'', //开始时间
				createTimeEnd:'', //结束时间
				size: 10,
				page: 1,
				total: 0
			});
			const tableData = ref([]);
			let { goodsId, sizeId, size, page, total } = toRefs(params)
			
			
			onMounted(async() => {
				await getDataList()
				await getGoodsList()
				maxHeight(pagination, queryForm, toolBar, ve_max_height);
			})
			
			
			/* 获取列表 */
			const getDataList = async () => {
				const { code, data, total } = await VE_API.businessFlow.businessFlowList(params);
				if(code == 200){
					tableData.value = data;
					params.total = total;
				}
				
			}
			
			
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
			   * @description  搜索商品发生变化
			   * @param 
			   * @return 
			   */
			const changeGoodsInfo = () => {
				params.goodsId = goodsInfo.value.id;
				sizeList.value = goodsInfo.value.sizeNames;
				onSubmit(params, getDataList)
			}

			/**
			  * @description  搜索日期发生变化
			  * @param 
			  * @return 
			  */
			
			const changeCreateTime = () => {
				if(createTime.value &&createTime.value.length){
					params.createTimeBegin = createTime.value[0] + ' 00:00:00';
					params.createTimeEnd = createTime.value[1] + ' 23:59:59';
				}else{
					params.createTimeBegin = '';
					params.createTimeEnd = '';
				}
				onSubmit(params, getDataList)
			}
			
			/**
			  * @description  跳转订单
			  * @param 
			  * @return 
			  */
			const toBusiness = (orderSn) => {
				let url;
				if(orderSn.indexOf('JH') != -1){
					url = '/purchase?orderSn=' + orderSn
				}else if(orderSn.indexOf('JT') != -1){
					url = '/purchaseReturn?orderSn=' + orderSn
				}else if(orderSn.indexOf('PH') != -1){
					url = '/sale?orderSn=' + orderSn
				}else if((orderSn.indexOf('PT') != -1)){
					url = '/saleReturn?orderSn=' + orderSn
				}
				router.push(url)
			}
			return {
				goodsInfo,
				params,
				goodsId, 
				sizeId,
				total,
				page,
				size,
				queryForm,
				pagination,
				toolBar,
				tableColumn,
				tableData,
				ve_max_height,
				getGoodsList,
				loading,
				goodsList,
				sizeList,
				onSubmit,
				resetForm,
				getDataList,
				handleSizeChange,
				handleCurrentChange,
				shortcuts,
				changeGoodsInfo,
				createTime,
				changeCreateTime
			}
		}
	}
</script>
<style lang="scss" scoped>

 .table {
	 &:deep(.goods-info){
		display: flex;
		align-items: center;
		.goods-img{
			width: 60px;
			height: 60px;
			display: flex;
			align-items: center;
			margin-right: 12px;
			img{
				width: 60px;
			}
		}
		.goods-name{
			flex:1;
			color: #7f7f8e;
			p{
				margin: 0;
			}
		}
	}
	
	&:deep(.stock-info){
		width: 100%;
		display: flex;
		.stock-item{
			width: 33.33%;
		}
		span{
			line-height: 40px;
			display: inline-block;
		}
		.s1{
			width: 90px;
			color: #99a9bf;
		}
	}
}
	
</style>