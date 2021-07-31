<template>
	<div class="sale">
		<div class="left">
			<detail ref="detail"  v-if="orderSn"  @getData="getData"  @changeOrderSn="changeOrderSn" :orderSn="orderSn"></detail>
			<add v-else  @getData="getData" @changeOrderSn="changeOrderSn"></add>
		</div>
		<div class="right">
			<list ref="list"  @changeOrderSn="changeOrderSn"></list>
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
			})
			return {
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
	.sale{
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
