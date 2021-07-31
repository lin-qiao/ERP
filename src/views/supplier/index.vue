<template>
	<!-- table工具条 -->
	<el-row ref="toolBar" class="ve_header_row_class_name ve_p_10">
	    <el-button
	        size="mini"
	        type="primary"
			@click="handleEdit('添加')"
	    >
			添加供应商
		</el-button>
	</el-row>
	<!-- 列表 -->
	
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
	    handleSizeChange,
	    handleCurrentChange,
	    maxHeight
	} from "@/views/layoutpages/common";
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
			
			
			
			const tableColumn = ref([
				{
					props: { prop: "supplierName", label: "供应商名称", minWidth: "200px" },
				},
				{
					props: { prop: "contact", label: "联系方式", minWidth: "150px"},
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
			/* 请求参数 */
			const params = reactive({
				size: 10,
				page: 1,
				total: 0
			});
			let { size, page, total } = toRefs(params)
			
			
			onMounted(async() => {
				await getDataList()
				maxHeight(pagination, queryForm, toolBar, ve_max_height);
			})
			
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
					const { code } = await VE_API.supplier.supplierDelete({ id });
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
			/* 获取列表 */
			const getDataList = async () => {
				const { code, data, total } = await VE_API.supplier.supplierList(params);
				console.log(total)
				if(code == 200){
					tableData.value = data;
					params.total = total;
				}
			}
			
			/* 点击添加供应商 */
			const handleAdd = () => {
				showDialog.value = true;
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
				getDataList
			}
		}
	}
</script>