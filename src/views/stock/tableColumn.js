	import {
		formatMoney
	} from '@/utils/index';
export const tableColumnGoods = [
	{
		props: { prop: "name", label: "商品信息", minWidth: "280px", showOverflowTooltip: true},
		default: (scope) => {
			return  (
				<div class="goods-info">
					<div class="goods-img">
						<el-image
							src={scope.row.imgUrl}
							fit="fit">
						</el-image>
					</div>
					<div class="goods-name ellipsis-text">
						<p class="p1">货号：<strong>{scope.row.goodsSn}</strong></p>
						<p class="p2 ellipsis-text"> {scope.row.goodsName} </p>
					</div>
				</div>
				
			)
		}
	},
	{
		props: { prop: "brandName", label: "品牌",  minWidth: "100px"},
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
		props: { prop: "totalNumber", label: "库存总量",  minWidth: "100px", sortable:'custom'},
	},
	{
		props: { prop: "costPrice", label: "成本单价", minWidth: "100px"},
		default: (scope) => {
			if(scope.row.totalCostPrice == 0){
				return '0.00'
			}else{
				return formatMoney(scope.row.totalCostPrice / scope.row.totalNumber)
			}
		}
	}, 
	{
		props: { prop: "totalCostPrice", label: "库存成本", minWidth: "100px" , sortable:'custom'},
		default: (scope) => {
			return  (
				formatMoney(scope.row.totalCostPrice)
			)
		}
	}
]

export const tableColumnSku = [
	{
		props: { prop: "name", label: "商品信息", minWidth: "280px", showOverflowTooltip: true},
		default: (scope) => {
			return  (
				<div class="goods-info">
					<div class="goods-img">
						<el-image
							src={scope.row.imgUrl}
							fit="fit">
						</el-image>
					</div>
					<div class="goods-name ellipsis-text">
						<p class="p1">货号：<strong>{scope.row.goodsSn}</strong></p>
						<p class="p2 ellipsis-text"> {scope.row.goodsName} </p>
					</div>
				</div>
				
			)
		}
	},
	{
		props: { prop: "brandName", label: "品牌",  minWidth: "100px"},
	},
	{
		props: { prop: "sizeName", label: "尺码", minWidth: "100px"},
	},
	{
		props: { prop: "number", label: "库存数量",  minWidth: "100px", sortable:'custom'},
	},
	{
		props: { prop: "costPrice", label: "成本单价", minWidth: "100px", sortable:'custom'},
		default: (scope) => {
			return  (
				formatMoney(scope.row.costPrice)
			)
		}
	}, 
	{
		props: { prop: "totalCostPrice", label: "库存成本", minWidth: "100px", sortable:'custom'},
		default: (scope) => {
			return  (
				formatMoney(scope.row.totalCostPrice)
			)
		}
	}
]