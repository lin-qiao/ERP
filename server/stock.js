const stockModel = require('../models/stock');
const stockGoodsModel = require('../models/stockGoods');
const brandModel = require('../models/brand');
const goodsModel = require('../models/goods');
const sizeModel = require('../models/size');
const util = require('../util/index');
/**
 * @description 库存单品列表
 * @param { page } 页数
 * @param { size } 条数
 */
const stockList = async function(ctx) {
	const {
		page = 1, 
		size = 10,
		goodSn = '',
		brandId = '',
		order = ''
	} = ctx.query;
	const uid = ctx.session.user_id;
	const {
		count,
		rows
	} = await stockModel.findAndCountAll(parseInt(page), parseInt(size), goodSn, brandId, uid, order)
	ctx.body = {
		code: 200,
		data: rows,
		total: count,
		message: '请求成功'
	}
}

/**
  * @description 库存商品列表
  * @param 
  * @return 
  */
const stockGoodsList = async function(ctx) {
 	const {
 		page = 1, 
		size = 10,
		keywords = '',
		goodSn = '',
		order = '',
		brandId = ''
 	} = ctx.query;
 	const uid = ctx.session.user_id;
	try{
		const data = await stockGoodsModel.findAndCountAllByGoods(parseInt(page), parseInt(size), goodSn, brandId, uid, order, keywords);
		const total = await stockGoodsModel.findCount(goodSn, brandId, uid);
		for (let i = 0; i < data.length; i++) {
			const obj = data[i].dataValues;
			if (obj.sizeIds) {
				const sizeInfo = await sizeModel.findByIds(obj.sizeIds, uid);
				obj.sizeNames = util.filterUnderLine(sizeInfo);
			}
		}

		ctx.body = {
			code: 200,
			data: data,
			total: total,
			message: '请求成功'
		}
	}catch(e){ 
		console.log(e)
		ctx.body = {
			code: 101,
			message: '系统错误'
		}
	}
 }

/**
  * @description 根据商品id获取库存信息
  * @param 
  * @return 
  */
const getGoodsStock = async function(ctx){
	const {
		goodsId
	} = ctx.query;
	if(!goodsId){
		ctx.body = {
			code: 101,
			message: '商品id不能为空'
		}
		return;
	}
	
	const uid = ctx.session.user_id;
	try{
		const detail = await goodsModel.findByGoodsId(goodsId);
		const data = await stockModel.findByGoodsId(goodsId, uid);
		ctx.body = {
			code: 200,
			data: data,
			detail: detail,
			message: '请求成功'
		}
	}catch(e){
		ctx.body = {
			code: 101,
			message: '系统异常'
		}
	}
	
}

/**
 * @description 库存统计
 */
const stockStat = async function(ctx) {
	const uid = ctx.session.user_id;
	
	const numberTotal = await stockModel.sumNumber(uid) || 0;
	const costPriceTotal = await stockModel.sumCostPrice(uid) || 0;
	
	ctx.body = {
		code: 200,
		data: {
			numberTotal,
			costPriceTotal
		},
		message: '请求成功'
	}
}


module.exports = {
	stockList,
	stockGoodsList,
	getGoodsStock,
	stockStat
}
