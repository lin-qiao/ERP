<template>
	<!-- 搜索 -->
	<el-form ref="queryForm" :inline="true" :model="params">
	    <el-form-item label="商品"  prop="goodSn">
	        <el-select
	            v-model="goodSn"
	    		value-key="articleNumber"
	            filterable
	            remote
	            reserve-keyword
	            placeholder="请输入商品名称/货号"
	            :remote-method="getGoodsList"
	            :loading="loading"
				@change="onSubmit(params, getDataList)"
			>
	            <el-option
	              v-for="item in goodsList"
	              :key="item.articleNumber"
	              :label="`${item.name} / ${item.goodSn}`"
	              :value="item.goodSn">
	    		  {{item.name}} / {{item.goodSn}}
	            </el-option>
	          </el-select>
	    </el-form-item>
		<el-form-item label="品牌" prop="brandId">
		    <el-select 
				v-model="brandId" 
				placeholder="请选择商品品牌"
				@change="onSubmit(params, getDataList)"
			>
		        <el-option
					v-for="item in brandList"
					:key="item.id"
					:label="item.brand_name"
					:value="item.id">
				</el-option>
			</el-select>
		</el-form-item>
		<el-form-item>
			<el-radio-group v-model="type" @change="changeType">
				<el-radio :label="1">商品列表</el-radio>
				<el-radio :label="2">单品列表</el-radio>
			</el-radio-group>
		</el-form-item>
		
	    <el-form-item>
	        <el-button
	            type="primary"
	            @click="onSubmit(params, getDataList)"
	            >搜索</el-button
	        >
	        <el-button @click="resetForm(queryForm, params, getDataList)"
	            >重置</el-button
	        >
	    </el-form-item>
	</el-form>
	<div class="sale-sum">
		<div class="sale-sum-item">
			<span class="tit">库存总数量</span>
			<span class="con">{{count.numberTotal}}</span>
		</div>
		<div class="sale-sum-item">
			<span class="tit">库存总成本</span>
			<span class="con">￥ {{formatMoney(count.costPriceTotal)}}</span>
		</div>
	</div>
	<!-- 列表 -->
	<table-com
		v-if="type == 1"
		class="table"
		:columns="tableColumnGoods"
		:data="tableGoodsData"
		style="width: 100%"
		:max-height="ve_max_height"
		@sort-change="sortChange"
	>
	</table-com>
	<table-com
		v-else
		class="table"
		:columns="tableColumnSku"
		:data="tableSkuData"
		style="width: 100%"
		:max-height="ve_max_height"
		@sort-change="sortChange"
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
		tableColumnGoods,
		tableColumnSku
	} from './tableColumn';
	import {
		formatMoney
	} from '@/utils/index';
	export default {
		setup(){		
			const ve_max_height = ref(0);
			const pagination = ref(null);
			const queryForm = ref(null);
			const toolBar = ref(null);
			
			const type = ref(1);   //1 商品模式 2 单品模式
			const loading = ref(false);
			const goodsList = ref([]);
			const brandList = ref([]);
			/* 请求参数 */
			const params = reactive({
				goodSn: '',
				brandId: '',
				order: '',
				size: 10,
				page: 1,
				total: 0
			});
			const tableGoodsData = ref([]);
			const tableSkuData = ref([]);
			const count = ref({});
			let { goodSn, brandId, size, page, total } = toRefs(params)
			
			
			onMounted(async() => {
				await getBrandList()
				await getDataList()
				maxHeight(pagination, queryForm, toolBar, ve_max_height);
			})
			
			
			/* 获取列表 */
			const getDataList = async () => {
				if(type.value == 1){
					const { code, data, total } = await VE_API.stock.stockGoodsList(params);
					if(code == 200){
						tableGoodsData.value = data;
						params.total = total;
					}
				}else{
					const { code, data, total } = await VE_API.stock.stockList(params);
					if(code == 200){
						tableSkuData.value = data;
						params.total = total;
					}
				}
				
			}
			
			
			/**
			  * @description 获取品牌列表
			  * @param 
			  * @return 
			  */
			const getBrandList = async () => {
				const { code, data } = await  VE_API.brand.brandList({page:1, size: 100});
				if(code == 200){
					brandList.value = data;
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
			  * @description 获取统计数据
			  * @param 
			  * @return 
			  */
			 const getStockStat = async () => {
				const { code, data } = await  VE_API.stock.stockStat();
				if(code == 200){
					count.value = data;
				}
			 }
			/**
			  * @description 改变查询模式
			  * @param 
			  * @return 
			  */
			const changeType = () => {
				params.page = 1;
				params.size = 10;
				params.order = '';
				onSubmit(params, getDataList)
			}
			
			/**
			  * @description 排序监听
			  * @param 
			  * @return 
			  */
			const sortChange = async ({order, prop}) => {
				if(order == 'ascending'){
					params.order = prop + ' ASC';
				}else if(order =='descending'){
					params.order = prop +  ' DESC'
				}
				await getDataList();
			}
			onMounted(async () => {
				await getStockStat()
				await getGoodsList()
			})
			return {
				params,
				goodSn,
				brandId,
				total,
				page,
				size,
				type,
				queryForm,
				pagination,
				toolBar,
				tableColumnGoods,
				tableGoodsData,
				tableColumnSku,
				tableSkuData,
				ve_max_height,
				getGoodsList,
				loading,
				goodsList,
				brandList,
				onSubmit,
				resetForm,
				getDataList,
				changeType,
				handleSizeChange,
				handleCurrentChange,
				count,
				formatMoney,
				getStockStat,
				sortChange
			}
		}
	}
</script>
<style lang="scss" scoped>

.sale-sum{
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 10px;
	.sale-sum-item{
		width: 50%;
		padding: 5px 0;
		border: 1px solid #d7d7d7;
		display: flex;
		justify-content: center;
		align-items: center;
		.tit{
			font-size: 14px;
		}
		.con{
			margin-left: 10px;
			font-size: 24px;
			color: #fe3800;
			line-height: 31px;
			font-family: "Microsoft YaHei","Open Sans","Helvetica Neue",Helvetica,Arial,sans-serif;
		}
	}
}
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