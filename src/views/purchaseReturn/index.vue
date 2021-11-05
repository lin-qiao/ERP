<template>
	<div class="purchase">
		<div class="left">
			<div v-show="!orderSn">
				<add  :supplierList="supplierList" @getData="getData" @changeOrderSn="changeOrderSn"></add>
			</div>
			<div  v-show="orderSn" >
				<detail ref="detail"  @getData="getData"  @changeOrderSn="changeOrderSn" :orderSn="orderSn"></detail>
			</div>
		</div>
		<div class="right">
			<list ref="list" :supplierList="supplierList" @changeOrderSn="changeOrderSn"></list>
		</div>
	</div>
</template>

<script>
	import { useStore } from "vuex";
	import { useRoute } from "vue-router"
	import {
		ref,
		onMounted,
		onUnmounted,
		computed,
		nextTick,
		getCurrentInstance
	} from 'vue';
	import list from './components/list'
	import add from './components/add'
	import detail from './components/detail'
	
	export default{
		components:{
			list,
			add,
			detail
		},
		setup(){
			const { proxy } = getCurrentInstance();
			const route = useRoute(); 
			const store = useStore();
			const list = ref(null);
			const detail = ref(null);
			const orderSn = ref(null);
			const supplierList = ref([]);
			
			
			/**
			  * @description 获取供应商列表
			  * @param 
			  * @return 
			  */
			const getSupplierList = async () => {
				const { code, data } = await  VE_API.supplier.supplierList({page:1, size: 100});
				if(code == 200){
					supplierList.value = data;
				}
			}
			
			/**
			  * @description 请求列表数据
			  * @param 
			  * @return 
			  */
			 
			const getData = () => {
				proxy.$refs.list.getDataList()
			}
			
			/**
			  * @description 切换订单
			  * @param 
			  * @return 
			  */
			const changeOrderSn = (sn) => {
				orderSn.value = sn;
				if(!sn) return;
				nextTick(() => {
				    proxy.$refs.detail.getData(sn)
				});
			}
			onMounted(async () => {
				if(route.query.orderSn){
					orderSn.value = route.query.orderSn
					nextTick(() => {
					    proxy.$refs.detail.getData(orderSn.value)
					});
				}
				await getSupplierList()
			})
			return {
				supplierList,
				getSupplierList,
				list,
				detail,
				getData,
				orderSn,
				changeOrderSn
			}
		}
	}
</script>

<style scoped lang="scss">
	.purchase{
		display: flex;
		.left{
			width: 70%;
		}
		.right{
			width: 30%;
			margin-left: 20px;
		}
	}
</style>
