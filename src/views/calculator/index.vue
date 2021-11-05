<template>
	<el-card class="box-card" style="width: 100%;">
		<template #header>
			<div class="card-header">
				<span>定金/免定金</span>
			</div>
		</template>
		<el-form ref="form" :model="form1" label-width="120px" :inline="true">
			<el-form-item label="购物金">
				<el-input v-model="form1.price1" placeholder="Pick a date" style="width: 80px; display: inline-block;">
				</el-input>
				<el-input v-model="form1.price2" placeholder="Pick a date"
					style="width: 80px; display: inline-block; margin-left: 10px;"></el-input>
			</el-form-item>
			<el-form-item label="定金">
				<el-input v-model="form1.deposit"></el-input>
			</el-form-item>
			<el-form-item label="总价">
				<el-input v-model="form1.totalPrice"></el-input>
			</el-form-item>
			<el-form-item label="数量">
				<el-input v-model="form1.number"></el-input>
			</el-form-item>
			<el-form-item label="免定金">
				<el-checkbox v-model="form1.check"></el-checkbox>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSubmit1">计算</el-button>
			</el-form-item>
		</el-form>
		<textarea v-model="res1" style="width: 500px;height: 100px;"> </textarea>
	</el-card>
	<el-card class="box-card" style="width: 100%;">
		<template #header>
			<div class="card-header">
				<span>凑单用过红包</span>
			</div>
		</template>
		<el-form ref="form" :model="form2" label-width="120px" :inline="true">
			<el-form-item label="购物金">
				<el-input v-model="form2.bprice1" placeholder="Pick a date" style="width: 80px; display: inline-block;">
				</el-input>
				<el-input v-model="form2.bprice2" placeholder="Pick a date"
					style="width: 80px; display: inline-block; margin-left: 10px;"></el-input>
			</el-form-item>
			<el-form-item label="价格">
				<el-input v-model="form2.bprice"></el-input>
			</el-form-item>
			<el-form-item label="总价">
				<el-input v-model="form2.btotalPrice"></el-input>
			</el-form-item>
			<el-form-item label="红包">
				<el-input v-model="form2.bredPrice"></el-input>
			</el-form-item>
			
			<el-form-item>
				<el-button type="primary" @click="onSubmit2">计算</el-button>
			</el-form-item>
		</el-form>
		<textarea v-model="res2" style="width: 500px;height: 100px;"> </textarea>
	</el-card>
</template>
<script>
	import {
		ref,
		computed,
		toRefs,
		reactive
	} from 'vue'
	export default {
		setup() {
			const form1 = reactive({
				price1: 1,
				price2: 1,
				deposit: 1,
				totalPrice: 1,
				number: 1,
				check: false,
			})
			let {
				price1,
				price2,
				deposit,
				totalPrice,
				number,
				check
			} = toRefs(form1);
			const res1 = ref('');
			
			
			const onSubmit1 = () => {

				let p1 = Number(price1.value);
				let p2 = Number(price2.value);
				let d = Number(deposit.value);
				let t = Number(totalPrice.value);
				let n = Number(number.value);
				const discount = p1 / p2; //购物金折扣
				const price = t / n * discount; //单价
				const total = d + price
				if (!check.value) {
					res1.value = total;
				} else {
					const pr = discount * (d - (d / (t / n + d) * d)) + (d / (t / n + d) * d)
					res1.value = total - pr;
				}
			}
			
			
			const form2 = reactive({
				bprice1: 1,
				bprice2: 1,
				btotalPrice: 1,
				bprice: 1,
				bredPrice: 1,
			})
			let {
				bprice1,
				bprice2,
				btotalPrice,
				bprice,
				bredPrice
			} = toRefs(form2);
			const res2 = ref('');
			
			const onSubmit2 = () => {
			
				let p1 = Number(bprice1.value);
				let p2 = Number(bprice2.value);
				let t = Number(btotalPrice.value);
				let p = Number(bprice.value);
				let red = Number(bredPrice.value);
				const discount = p1 / p2; //购物金折扣
				const  total = t / (red + t) * p;
				res2.value = total * discount;
			}
			return {
				form1,
				res1,
				onSubmit1,
				form2,
				res2,
				onSubmit2,
			};
		}
	}
</script>
<style>
	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.text {
		font-size: 14px;
	}

	.item {
		margin-bottom: 18px;
	}

	.box-card {
		width: 480px;
	}
</style>
