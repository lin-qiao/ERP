const businessFlowModel = require('../models/businessFlow');
const util = require('../util/index');
const date = require('../util/date.js');
/**
 * 库存流水
 * @param { page } 页数
 * @param { size } 条数
 */
const businessFlowList = async function(ctx) {
	const {
		page = 1,
			size = 10,
			goodsId = '',
			sizeId = '',
			createTimeBegin = '', //开始时间
			createTimeEnd = '' //结束时间

	} = ctx.query;
	const uid = ctx.session.user_id;
	const {
		count,
		rows
	} = await businessFlowModel.findAndCountAll(parseInt(page), parseInt(size), goodsId, sizeId,
		createTimeBegin, createTimeEnd, uid)
	const list = util.filterUnderLine(rows)
	ctx.body = {
		code: 200,
		data: list,
		total: count,
		message: '请求成功'
	}
}

/**
 * 销售报表
 * @param { page } 页数
 * @param { size } 条数
 * @param { type } 类型
 */
const saleStatList = async function(ctx) {
	const {
		page = 1,
			size = 10,
			type = 'thisMonth'

	} = ctx.query;
	const uid = ctx.session.user_id;
	let createTimeBegin, createTimeEnd;
	if (type == 'thisMonth') {
		createTimeBegin = date.getMonthStartDate() + ' 00:00:00';
		createTimeEnd = date.getMonthEndDate() + ' 23:59:59';
	} else if (type == 'lastMonth') {
		createTimeBegin = date.getLastMonthStartDate() + ' 00:00:00';
		createTimeEnd = date.getLastMonthEndDate() + ' 23:59:59';
	} else if (type == 'thisYear') {
		createTimeBegin = date.getYearStartDate() + ' 00:00:00';
		createTimeEnd = date.getYearEndDate() + ' 23:59:59';
	} else if (type == 'lastYear') {
		createTimeBegin = date.getLastYearStartDate() + ' 00:00:00';
		createTimeEnd = date.getLastYearEndDate() + ' 23:59:59';
	} else if (type == 'all') {
		createTimeBegin = '';
		createTimeEnd = '';
	}
	const {
		count,
		rows
	} = await businessFlowModel.findAndCountAll(parseInt(page), parseInt(size), '', '', createTimeBegin,
		createTimeEnd, uid, 'sale')
	const list = util.filterUnderLine(rows)
	ctx.body = {
		code: 200,
		data: list,
		total: count,
		message: '请求成功'
	}
}

/**
 * 销售统计
 * @param { type } 类型
 */
const saleCount = async function(ctx) {
	const {
		type = 'thisMonth'

	} = ctx.query;
	const uid = ctx.session.user_id;
	if (type == 'thisMonth') {
		createTimeBegin = date.getMonthStartDate() + ' 00:00:00';
		createTimeEnd = date.getMonthEndDate() + ' 23:59:59';
	} else if (type == 'lastMonth') {
		createTimeBegin = date.getLastMonthStartDate() + ' 00:00:00';
		createTimeEnd = date.getLastMonthEndDate() + ' 23:59:59';
	} else if (type == 'thisYear') {
		createTimeBegin = date.getYearStartDate() + ' 00:00:00';
		createTimeEnd = date.getYearEndDate() + ' 23:59:59';
	} else if (type == 'lastYear') {
		createTimeBegin = date.getLastYearStartDate() + ' 00:00:00';
		createTimeEnd = date.getLastYearEndDate() + ' 23:59:59';
	} else if (type == 'all') {
		createTimeBegin = '';
		createTimeEnd = '';
	}
	try {
		//总数量
		const saleNumber = await businessFlowModel.sumNumber(3, uid, 'number', createTimeBegin,
			createTimeEnd) || 0;
		const saleReturnNumber = await businessFlowModel.sumNumber(4, uid, 'number', createTimeBegin,
			createTimeEnd) || 0;
		const numberTotal = +saleNumber + saleReturnNumber;
		//总销售额
		const salePrice = await businessFlowModel.sumNumber(3, uid, 'totalBusinessPrice', createTimeBegin,
			createTimeEnd) || 0;
		const saleReturnPrice = await businessFlowModel.sumNumber(4, uid, 'totalBusinessPrice', createTimeBegin,
			createTimeEnd) || 0;
		const priceTotal = (salePrice * 100 - saleReturnPrice * 100) / 100;
		//总毛利
		const saleGrossProfit = await businessFlowModel.sumNumber(3, uid, 'grossProfitPrice', createTimeBegin,
			createTimeEnd) || 0;
		const saleReturnGrossProfit = await businessFlowModel.sumNumber(4, uid, 'grossProfitPrice',
			createTimeBegin, createTimeEnd) || 0;
		const grossProfitTotal = (saleGrossProfit * 100 + saleReturnGrossProfit * 100) / 100
		//毛利率
		const grossProfitRate = Math.round(grossProfitTotal / priceTotal * 10000) / 100;
		ctx.body = {
			code: 200,
			data: {
				numberTotal,
				priceTotal,
				grossProfitTotal,
				grossProfitRate
			},
			message: '请求成功'
		}
	} catch (e) {
		console.log(e)
		ctx.body = {
			code: 101,
			message: '系统异常'
		}
	}

}


/**
 * 采购报表
 * @param { page } 页数
 * @param { size } 条数
 */
const purchaseStatList = async function(ctx) {
	const {
		page = 1,
			size = 10,
			type = 'thisMonth'

	} = ctx.query;
	const uid = ctx.session.user_id;
	let createTimeBegin, createTimeEnd;
	if (type == 'thisMonth') {
		createTimeBegin = date.getMonthStartDate() + ' 00:00:00';
		createTimeEnd = date.getMonthEndDate() + ' 23:59:59';
	} else if (type == 'lastMonth') {
		createTimeBegin = date.getLastMonthStartDate() + ' 00:00:00';
		createTimeEnd = date.getLastMonthEndDate() + ' 23:59:59';
	} else if (type == 'thisYear') {
		createTimeBegin = date.getYearStartDate() + ' 00:00:00';
		createTimeEnd = date.getYearEndDate() + ' 23:59:59';
	} else if (type == 'lastYear') {
		createTimeBegin = date.getLastYearStartDate() + ' 00:00:00';
		createTimeEnd = date.getLastYearEndDate() + ' 23:59:59';
	} else if (type == 'all') {
		createTimeBegin = '';
		createTimeEnd = '';
	}
	const {
		count,
		rows
	} = await businessFlowModel.findAndCountAll(parseInt(page), parseInt(size), '', '', createTimeBegin,
		createTimeEnd, uid, 'purchase')
	const list = util.filterUnderLine(rows)
	ctx.body = {
		code: 200,
		data: list,
		total: count,
		message: '请求成功'
	}
}

/**
 * 采购统计
 * @param { page } 页数
 * @param { size } 条数
 */
const purchaseCount = async function(ctx) {
	const {
		type = 'thisMonth'

	} = ctx.query;
	const uid = ctx.session.user_id;
	if (type == 'thisMonth') {
		createTimeBegin = date.getMonthStartDate() + ' 00:00:00';
		createTimeEnd = date.getMonthEndDate() + ' 23:59:59';
	} else if (type == 'lastMonth') {
		createTimeBegin = date.getLastMonthStartDate() + ' 00:00:00';
		createTimeEnd = date.getLastMonthEndDate() + ' 23:59:59';
	} else if (type == 'thisYear') {
		createTimeBegin = date.getYearStartDate() + ' 00:00:00';
		createTimeEnd = date.getYearEndDate() + ' 23:59:59';
	} else if (type == 'lastYear') {
		createTimeBegin = date.getLastYearStartDate() + ' 00:00:00';
		createTimeEnd = date.getLastYearEndDate() + ' 23:59:59';
	} else if (type == 'all') {
		createTimeBegin = '';
		createTimeEnd = '';
	}
	try {
		//总数量
		const saleNumber = await businessFlowModel.sumNumber(1, uid, 'number', createTimeBegin,
			createTimeEnd) || 0;
		const saleReturnNumber = await businessFlowModel.sumNumber(2, uid, 'number', createTimeBegin,
			createTimeEnd) || 0;
		const numberTotal = +saleNumber + saleReturnNumber;

		//总成本
		const saleCostTotal = await businessFlowModel.sumNumber(1, uid, 'totalBusinessPrice', createTimeBegin,
			createTimeEnd) || 0;
		const saleReturnCostTotal = await businessFlowModel.sumNumber(2, uid, 'totalBusinessPrice',
			createTimeBegin, createTimeEnd) || 0;
		const costTotal = (saleCostTotal * 100 - saleReturnCostTotal * 100) / 100;
		ctx.body = {
			code: 200,
			data: {
				numberTotal,
				costTotal,
			},
			message: '请求成功'
		}
	} catch (e) {
		console.log(e)
		ctx.body = {
			code: 101,
			message: '系统异常'
		}
	}

}

/**
 * 商品销售报表
 * @param { page } 页数
 * @param { size } 条数
 */
const goodsSaleStatList = async function(ctx) {
	const {
		page = 1,
			size = 10,
			type = 'thisMonth',
			order = ''

	} = ctx.query;
	const uid = ctx.session.user_id;
	let createTimeBegin, createTimeEnd;
	if (type == 'thisMonth') {
		createTimeBegin = date.getMonthStartDate() + ' 00:00:00';
		createTimeEnd = date.getMonthEndDate() + ' 23:59:59';
	} else if (type == 'lastMonth') {
		createTimeBegin = date.getLastMonthStartDate() + ' 00:00:00';
		createTimeEnd = date.getLastMonthEndDate() + ' 23:59:59';
	} else if (type == 'thisYear') {
		createTimeBegin = date.getYearStartDate() + ' 00:00:00';
		createTimeEnd = date.getYearEndDate() + ' 23:59:59';
	} else if (type == 'lastYear') {
		createTimeBegin = date.getLastYearStartDate() + ' 00:00:00';
		createTimeEnd = date.getLastYearEndDate() + ' 23:59:59';
	} else if (type == 'all') {
		createTimeBegin = '';
		createTimeEnd = '';
	}
	const data = await businessFlowModel.findAllGoods(parseInt(page), parseInt(size), createTimeBegin,
		createTimeEnd, uid, 'sale', order)
	ctx.body = {
		code: 200,
		data: data,
		// total: count,
		message: '请求成功'
	}
}

/**
 * 品牌销售报表
 * @param { page } 页数
 * @param { size } 条数
 */
const brandSaleStatList = async function(ctx) {
	const {
		page = 1,
			size = 10,
			type = 'thisMonth',
			order = ''

	} = ctx.query;
	const uid = ctx.session.user_id;
	let createTimeBegin, createTimeEnd;
	if (type == 'thisMonth') {
		createTimeBegin = date.getMonthStartDate() + ' 00:00:00';
		createTimeEnd = date.getMonthEndDate() + ' 23:59:59';
	} else if (type == 'lastMonth') {
		createTimeBegin = date.getLastMonthStartDate() + ' 00:00:00';
		createTimeEnd = date.getLastMonthEndDate() + ' 23:59:59';
	} else if (type == 'thisYear') {
		createTimeBegin = date.getYearStartDate() + ' 00:00:00';
		createTimeEnd = date.getYearEndDate() + ' 23:59:59';
	} else if (type == 'lastYear') {
		createTimeBegin = date.getLastYearStartDate() + ' 00:00:00';
		createTimeEnd = date.getLastYearEndDate() + ' 23:59:59';
	} else if (type == 'all') {
		createTimeBegin = '';
		createTimeEnd = '';
	}
	const data = await businessFlowModel.findAllBrands(parseInt(page), parseInt(size), createTimeBegin,
		createTimeEnd, uid, 'sale', order)
	ctx.body = {
		code: 200,
		data: data,
		// total: count,
		message: '请求成功'
	}
}


module.exports = {
	businessFlowList,
	saleStatList,
	saleCount,
	purchaseStatList,
	purchaseCount,
	goodsSaleStatList,
	brandSaleStatList
}
