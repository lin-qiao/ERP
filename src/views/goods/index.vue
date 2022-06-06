<template>
	<!-- 搜索 -->
	<el-form ref="queryForm" :inline="true" :model="params">
	    <el-form-item label="商品"  prop="name">
	        <el-input
				clearable
				v-model="name" 
				placeholder="请输入商品名称"
			>
			</el-input>
	    </el-form-item>
		<el-form-item label="品牌" prop="brandId">
		    <el-select
				clearable
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
	<!-- table工具条 -->
	<toolbar
		title="商品列表"
	>
	<template #btns>
		<el-button
		    size="mini"
		    type="primary"
			@click="handleEdit('添加')"
		>
			添加商品
		</el-button>
	</template>
	</toolbar>
	<!-- 列表 -->
	<table-com
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
      @current-change="
          val => handleCurrentChange(val, params, getDataList)
      "
      :hide-on-single-page="total <= size ? true : false"
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[10, 20, 50, 100]"
      :current-page="page"
      :page-size="size"
      :total="total"
  >
  </el-pagination>
  <edit
	v-if="showDialog"
	:title="dialogTitle"
	:rowData="rowData"
	:showDialog="showDialog"
	@closeDialog="handelDialog($event)"
  >
  </edit>
</template>

<script>
	import edit from './edit.vue';
	import { 
		ref, 
		reactive,
		onMounted,
		toRefs,
		getCurrentInstance,  //获取当前组件实例
	} from 'vue';
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
	import { useRouter } from "vue-router";
	export default {
		components:{
			edit
		},
		setup(){			
			const { proxy } = getCurrentInstance();
			const tableData = ref([]);
			/* 弹窗参数 */
			const dialogTitle = ref('');
			const showDialog = ref(false);
			const rowData = ref(null);
			const ve_max_height = ref(0);
			const toolBar = ref(null);
			const pagination = ref(null);
			const queryForm = ref(null);
			const brandList = ref([]);
			/* 请求参数 */
			const params = reactive({
				size: 10,
				page: 1,
				total: 0,
				name: '',
				brandId: ''
			});
			const tableColumn = ref([
				{
					props: { prop: "name", label: "商品名称", minWidth: "200px" },
				},
				{
					props: { prop: "goodSn", label: "商品货号", minWidth: "150px"},
				},
				{
					props: { prop: "brandName", label: "品牌",  width: "100px"},
				},
				{
					props: { prop: "imgUrl", label: "图片", width: "100px"},
					default: (scope) => {
						return  (
							<el-image
								style="max-height: 52px;max-width: 52px;"
								src={scope.row.imgUrl}
								fit="fit">
							</el-image>
						)
					}
				},
				{
					props: { prop: "purchasePrice", label: "采购价", width: "100px"},
					default: (scope) => {
						return  (
							formatMoney(scope.row.purchasePrice)
						)
					}
				},
				{
					props: { prop: "sizeNames", label: "尺码", minWidth: "250px", showOverflowTooltip: true},
					default: (scope) => {
						return  (
							scope.row.sizeNames.map(item => item.sizeName).join('，')
						)
					}
				},
				{
					props: { prop: "createTime",  label: "修改时间", width: '180px' },
					default: (scope) => {
						return  (
							new Date(scope.row.createTime).Format('yyyy-MM-dd hh:mm:ss')
						)
					}
				},
				
				{
					props: {
						prop: "action",
						label: "操作",
						fixed: 'right',
						width: '150px'
					},
					default: (scope) => {
						return (
							<>
								<el-button 
									type="primary"
									size="mini"
									onClick={() => handleEdit('编辑', scope.row)}
								>
									编辑
								</el-button>
								<el-button 
									type="danger"
									size="mini" 
									onClick={() => handleDel(scope.row.id)}
								>
									删除
								</el-button>
							</>
						);
					},
				}
			])
			let { size, page, total, brandId, name } = toRefs(params)
			
			
			onMounted(async() => {
				await getBrandList()
				await getDataList()
				maxHeight(pagination, queryForm, toolBar, ve_max_height);
			})
			
			
			/* 获取列表 */
			const getDataList = async () => {
				const { code, data, total } = await VE_API.goods.goodsList(params);
				console.log(total)
				if(code == 200){
					tableData.value = data;
					params.total = total;
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
			 
			/* 点击添加 */
			const handleAdd = () => {
				showDialog.value = true;
			}
			
			/**
			  * @description 点击添加或者编辑
			  * @param 
			  * @return 
			  */
			const handleEdit = (title, row = null) => {
				showDialog.value = true;
				rowData.value = row;
				dialogTitle.value = title;
			}
			/* 点击删除 */
			const handleDel = id => {
				proxy.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "error"
				})
				.then(async () => {
					const { code } = await VE_API.goods.goodsDelete({ id });
					if (code == 200) {
						getDataList();
					}
				})
				.catch(() => {
					proxy.$message({
						type: "info",
						message: "已取消删除"
					});
				});
			}
			
			/**
			  * @description dialog事件
			  * @param 
			  * @return 
			  */
			const handelDialog = e => {
				showDialog.value = e;
				getDataList();
			}
			return {
				params,
				total,
				page,
				size,
				brandId,
				name,
				tableColumn,
				ve_max_height,
				toolBar,
				pagination,
				queryForm,
				dialogTitle,
				showDialog,
				rowData,
				tableData,
				handleEdit,
				handleDel,
				handelDialog,
				handleSizeChange,
				handleCurrentChange,
				getDataList,
				brandList,
				onSubmit,
				resetForm
			}
		}
	}
</script>