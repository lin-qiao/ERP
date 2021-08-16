<template>
	<el-dialog
	    :title="title"
	    append-to-body
	    destroy-on-close
	    :model-value="showDialog"
	    @close="closeDialog()"
	>
		<el-form
		    ref="formRef"
		    :model="form"
		    label-width="80px"
		    :rules="rules"
		    :inline="false"
		>
			<el-form-item label="搜索商品">
			    <el-select
					style="width: 100%;"
			        v-model="goodsInfo"
					value-key="articleNumber"
			        filterable
			        remote
			        reserve-keyword
			        placeholder="请输入商品名称/货号搜索商品"
			        :remote-method="getGoodsBySn"
			        :loading="loading"
					@change="changeGoodsInfo">
			        <el-option
			          v-for="item in goodsList"
			          :key="item.articleNumber"
			          :label="`${item.title} / ${item.articleNumber}`"
			          :value="item">
					  {{item.title}} / {{item.articleNumber}}
			        </el-option>
			      </el-select>
			</el-form-item>
			<el-form-item label="商品名称" prop="name">
			    <el-input
			        clearable
			        v-model="name"
			        placeholder="请选择商品名称"
			    ></el-input>
			</el-form-item>
			<el-form-item label="商品货号" prop="goodSn">
			    <el-input
			        clearable
			        v-model="goodSn"
			        placeholder="请选择商品货号"
			    ></el-input>
			</el-form-item>
			<el-form-item label="商品图片" prop="imgUrl">
			    <el-input
			        clearable
			        v-model="imgUrl"
			        placeholder="请输入商品图片"
			    ></el-input>
			</el-form-item>
			<el-form-item label="图片预览">
				<el-image
					style="max-height: 52px;max-width: 52px;"
					:src="imgUrl"
				>
				</el-image>
			</el-form-item>
			
			<el-form-item label="采购价" prop="purchasePrice">
				<el-input-number
					style="width: 100%;"
					clearable
					v-model="purchasePrice" 
					:precision="2"
					:controls="false"
					placeholder="请输入采购价"
					>
				</el-input-number>
			</el-form-item>
			<el-form-item label="商品品牌" prop="brandId">
			    <el-select v-model="brandId" placeholder="请选择商品品牌" style="width: 100%;">
			        <el-option
			          v-for="item in brandList"
			          :key="item.id"
			          :label="item.brand_name"
			          :value="item.id">
			        </el-option>
			      </el-select>
			</el-form-item>
			<el-form-item label="商品尺码" prop="sizeIds">
			    <el-checkbox-group v-model="sizeIds"  placeholder="请选择商品尺码">
					<el-checkbox
						v-for="item in sizeList"
						:key="item.id"
						:label="item.id"
						:value="item.id"
					>
					{{item.size_name}}
					</el-checkbox>
				</el-checkbox-group>
			</el-form-item>
		</el-form>
		<template #title>
			
		</template>
		<template v-slot:footer>
			<span>
				<el-button @click="closeDialog()">取消</el-button>
				<el-button type="primary" @click="onSubmit()">确定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script>
	import {
		ref,
		reactive,
		toRefs,
		computed,
		onMounted,
		getCurrentInstance
	} from 'vue';
	
	export default {
		props:{
			title:{
				type: String,
				default: '添加'
			},
			rowData: {
			    type: Object,
			    default: null
			},
			showDialog: {
				type: Boolean,
				default: false
			}
		},
		emits:['closeDialog'],
		setup(props, { emit }){
			const { proxy } = getCurrentInstance();
			const { rowData } = toRefs(props);
			
			const formRef = ref(null);
			const brandList = ref([]);
			const sizeList = ref([]);
			const goodsList = ref([]);
			const loading = ref(false);
			const goodsInfo = ref({});
			const form = reactive({
				name: '',
				goodSn: '',
				imgUrl: '',
				brandId: '',
				sizeIds: [],
				purchasePrice: '',
			})
			const { 
				name,
				goodSn,
				imgUrl,
				brandId,
				sizeIds,
				purchasePrice,
			 } = toRefs(form);
			
			/**
			  * @description 初始化表单
			  * @param 
			  * @return 
			  */
			rowData.value  && (
				form.name = rowData.value.name,
				form.goodSn = rowData.value.goodSn,
				form.imgUrl = rowData.value.imgUrl,
				form.brandId = rowData.value.brandId,
				form.sizeIds = rowData.value.sizeIds.split(',').map(item => parseInt(item)),
				form.purchasePrice = rowData.value.purchasePrice
			)
			
			/* 表单规则 */
			const rules = computed(() => ({
				name: {
					required: true,
					message: "请输入商品名称",
					trigger: "blur"
				},
				goodSn: {
					required: true,
					message: "请输入商品货号",
					trigger: "blur"
				},
				brandId: {
					required: true,
					message: "请输入品牌名称",
					trigger: "blur"
				},
				sizeIds: {
					required: true,
					message: "请选择商品尺码",
					trigger: "blur"
				},
				
			}))
			
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
			  * @description 获取尺码列表
			  * @param 
			  * @return 
			  */
			const getSizeList = async () => {
				const { code, data } = await  VE_API.size.sizeList({page:1, size: 100});
				if(code == 200){
					sizeList.value = data;
					// 新增默认选择第一条
					if(!rowData.value){
						sizeIds.value = [data[0].id];
					}
				}
			}
			
			/**
			  * @description 远程搜索商品货号
			  * @param 
			  * @return 
			  */
			 const getGoodsBySn = async (query) => {
				 if(!query){
					 goodsList.value = [];
					 return;
				 }
				 loading.value = true;
				 const { code, data } = await  VE_API.goods.getGoodsBySn({code: query});
				 if(code == 200){
				 	goodsList.value = data;
				 }
				 loading.value = false;
			 }
			 
			 /**
			   * @description 搜索商品选中值发生变化
			   * @param 
			   * @return 
			   */
			const changeGoodsInfo = (obj) => {
				form.name = obj.title;
				form.goodSn = obj.articleNumber;
				form.imgUrl = obj.logoUrl;
			}
			
			/* 提交表单 */
			const onSubmit = () => {
				formRef.value.validate(async valid => {
				    if (valid) {
				        let res;
				        if (rowData.value && rowData.value.id) {
				        	res = await VE_API.goods.goodsUpdate({
				        	    id: rowData.value.id,
				        	    name: name.value.trim(),
				        	    goodSn: goodSn.value.trim(),
				        	    imgUrl: imgUrl.value.trim(),
				        	    brandId: brandId.value,
				        	    sizeIds: sizeIds.value.join(),
				        	    purchasePrice: Number(purchasePrice.value) || 0
				        	});
				        } else {
				            res = await VE_API.goods.goodsAdd({
								name: name.value.trim(),
								goodSn: goodSn.value.trim(),
								imgUrl: imgUrl.value.trim(),
								brandId: brandId.value,
								sizeIds: sizeIds.value.join(),
								purchasePrice: Number(purchasePrice.value) || 0
							});
				        }
				        const { code, message } = res;
				        if (code == 200) {
							proxy.$message({
								type: 'success',
								message: message
							})
				            closeDialog();
				        }
				    }
				});
			}
			const closeDialog = () => {
				emit('closeDialog', false)
			}
			
			onMounted(() => {
				getBrandList()
				getSizeList()
			})
			
			return {
				formRef,
				form,
				name,
				goodSn,
				imgUrl,
				brandId,
				sizeIds,
				purchasePrice,
				brandList,
				sizeList,
				goodsList,
				goodsInfo,
				onSubmit,
				rules,
				closeDialog,
				getGoodsBySn,
				changeGoodsInfo,
				loading,
				
			}
		}
	}
</script>

<style>
</style>
