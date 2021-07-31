<template>
	<!-- table工具条 -->
	<el-row ref="toolBar" class="ve_header_row_class_name ve_p_10">
	    <el-button
	        size="mini"
	        type="primary"
			@click="handleEdit('添加')"
	    >
			添加品牌
		</el-button>
	</el-row>
	<!-- 列表 -->
	<el-table
		:data="tableData"
		stripe
		border
		highlight-current-row
		header-row-class-name="ve_header_row_class_name"
		header-cell-class-name="ve_header_cell_class_name"
		style="width: 100%"
		:max-height="ve_max_height"
	>
		
		<el-table-column 
			v-for="item in tableColumn"
			:prop="item.prop"
			:label="item.label"
			:formatter="item.render? item.render : null"
		> 
		</el-table-column>
		<el-table-column fixed="right" label="操作">
			<template v-slot:default="{ row }">
				<el-button
					@click.prevent="handleEdit('编辑', row)"
					type="primary"
					size="mini"
				>
					编辑
				</el-button>
				<el-button
					@click.prevent="handleDel(row.id)"
					type="danger"
					size="mini"
				>
					删除
				</el-button>
			</template>
		</el-table-column>
	</el-table>
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
			/* 请求参数 */
			const params = reactive({
				size: 10,
				page: 1,
				total: 0
			});
			const tableColumn = ref([
				{
					prop: 'brand_name',
					label: '品牌名称',
				},
				{
					prop: 'create_time',
					label: '修改时间',
					render:(row) => {
						return new Date(row.create_time).Format('yyyy-MM-dd hh:mm:ss')
					}
				},
			])
			let { size, page, total } = toRefs(params)
			
			
			onMounted(async() => {
				await getDataList()
				maxHeight(pagination, queryForm, toolBar, ve_max_height);
			})
			
			
			/* 获取列表 */
			const getDataList = async () => {
				const { code, data, total } = await VE_API.brand.brandList(params);
				console.log(total)
				if(code == 200){
					tableData.value = data;
					params.total = total;
				}
			}
			
			/* 点击添加品牌 */
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
					const { code } = await VE_API.brand.brandDelete({ id });
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