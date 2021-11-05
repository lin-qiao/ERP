<template>
	<ul class="search-list">
		<li v-for="item in dateList" :class="item.value == type? 'on': ''" @click="handleChangeType(item.value)">
			{{item.label}}
		</li>
	</ul>
	<div class="sale-sum">
		<div class="sale-sum-item">
			<span class="tit">销售单品数</span>
			<span class="con">{{count.numberTotal}}</span>
		</div>
		<div class="sale-sum-item">
			<span class="tit">销售额</span>
			<span class="con">￥ {{formatMoney(count.priceTotal)}}</span>
		</div>
		<div class="sale-sum-item">
			<span class="tit">销售毛利</span>
			<span class="con">￥ {{formatMoney(count.grossProfitTotal)}}</span>
		</div>
		<div class="sale-sum-item">
			<span class="tit">销售毛利率(%) </span>
			<span class="con">{{count.grossProfitRate}}</span>
		</div>
	</div>
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
			
			const dateList = ref([
				{
					value:'thisMonth',
					label:'本月'
				},
				{
					value:'lastMonth',
					label:'上月'
				},
				{
					value:'thisYear',
					label:'本年'
				},
				{
					value:'all',
					label:'全部'
				},
			])
			const tableColumn = ref([
				{
					props: { prop: "goodsName", label: "商品名称", minWidth: '280px'},
					default:({row}) => {
						return row.goodsName
					}
				},
				{
					props: { prop: "goodsSn", label: "货号", minWidth: '150px'},
					default:({row}) => {
						return row.goodsSn
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
					props: { prop: "number", label: "单品数量", width: '110px'},
				},
				{
					props: { prop: "businessPrice", label: "单价", width: "100px"},
					default: (scope) => {
						return  (
							formatMoney(scope.row.businessPrice)
						)
					}
				},
				{
					props: { prop: "businessPrice", label: "总价", width: "100px"},
					default: (scope) => {
						return  (
							formatMoney(scope.row.totalBusinessPrice)
						)
					}
				}, 
				{
					props: { prop: "costPrice", label: "采购均价", width: "120px"},
					default: (scope) => {
						return  (
							formatMoney(scope.row.costPrice)
						)
					}
				}, 
				{
					props: { prop: "totalPrice", label: "毛利润", width: "120px"},
					default: (scope) => {
						return formatMoney(scope.row.grossProfitPrice)
					}
				},
				{
					props: { prop: "createTime", label: "时间", minWidth: '160px'},
					default:({row}) => {
						return new Date(row.createTime).Format('yyyy-MM-dd hh:mm:ss')
					}
				},
			]);
			/* 请求参数 */
			const params = reactive({
				size: 10,
				page: 1,
				total: 0,
				type: 'thisMonth'
			});
			const tableData = ref([]);
			let {size, page, total, type } = toRefs(params)
			
			const count = ref({});
			onMounted(async() => {
				await getDataList()
				await getSaleCount()
				maxHeight(pagination, queryForm, toolBar, ve_max_height);
			})
			
			
			/* 获取列表 */
			const getDataList = async () => {
				const { code, data, total } = await VE_API.businessFlow.saleStatList(params);
				if(code == 200){
					tableData.value = data;
					params.total = total;
				}
				
			}
			
			/**
			  * @description  跳转订单
			  * @param 
			  * @return 
			  */
			const getSaleCount = async () => {
				const { code, data } = await VE_API.businessFlow.saleCount({
					type: type.value
				});
				if(code == 200){
					count.value = data;
				}
				
			}
			/**
			  * @description  跳转订单
			  * @param 
			  * @return 
			  */
			const toBusiness = (orderSn) => {
				let url;
				if(orderSn.indexOf('PH') != -1){
					url = '/sale?orderSn=' + orderSn
				}else if((orderSn.indexOf('PT') != -1)){
					url = '/saleReturn?orderSn=' + orderSn
				}
				router.push(url)
			}
			/**
			  * @description  改变type
			  * @param 
			  * @return 
			  */
			 const handleChangeType = async (value) => {
				params.type = value;
				await getDataList()
				await getSaleCount();
			 }
			
			return {
				params,
				total,
				page,
				size,
				type,
				queryForm,
				pagination,
				toolBar,
				tableColumn,
				tableData,
				ve_max_height,
				getDataList,
				handleSizeChange,
				handleCurrentChange,
				count,
				formatMoney,
				dateList,
				handleChangeType 
			}
		}
	}
</script>
<style lang="scss" scoped>
.search-list{
	display: flex;
	list-style: none;
	padding: 0;
	li{
		font-style: none;
		line-height: 30px;
		font-size: 15px;
		cursor: pointer;
		padding: 0 10px;
		color: #222;
		&.on{
			color: $base_color;
		}
	}
}
.sale-sum{
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 10px;
	.sale-sum-item{
		width: 25%;
		padding: 5px 0;
		border: 1px solid #d7d7d7;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 43px;
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