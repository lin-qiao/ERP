import {
	formatMoney
} from '@/utils/index';
export default [
	{
		props: {prop:'goodsName', label: "商品",  minWidth: "200px"},
	},
	{
		props: {prop:'goodsSn',label: "货号",  minWidth: "100px"},
	},
	{
		props: {prop:'sizeName', label: "尺码",  width: "100px"},
	},
	{
		props: {prop:'quantity',  label: "数量",  width: "80px"},

	},
	{
		props: {prop:'price',  label: "单价",  width: "100px"},
		default: (scope) => {
			return  (
				scope.row.price.toFixed(2)
			)
		}
	},
	{
		props: {prop:'amount',  label: "总价",  width: "100px"},
		default: (scope) => {
			return  (
				scope.row.amount.toFixed(2)
			)
		}
	},
]
