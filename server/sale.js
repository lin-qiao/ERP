const saleModel = require('../models/sale');
const saleGoodsModel = require('../models/saleGoods');
const businessFlowModel = require('../models/businessFlow');
const stockModel = require('../models/stock');
const util = require('../util/index');
/**
 * 销售列表
 * @param { page } 页数
 * @param { limit } 条数
 * @param { status } 1销售 2撤销
 */
const saleList = async function(ctx) {
	const {
		page = 1, 
		size = 10, 
		status = 1,
		itemType = 1,
		createTimeBegin = '', 
		createTimeEnd = ''
	} = ctx.query;
	const uid = ctx.session.user_id;
	const {
		count,
		rows
	} = await saleModel.findAndCountAll(parseInt(page), parseInt(size), status, createTimeBegin, createTimeEnd, itemType, uid)

	const list = util.filterUnderLine(rows)
	ctx.body = {
		code: 200,
		data: list,
		total: count,
		message: '请求成功'
	}
}

/**
  * @description 新增销售
  * @param itemType	1销售 2退货
  * @param goods	商品列表
  * @return 
  */
 
 const saleAdd = async function(ctx) {
 	const {
		itemType,
		goods
 	} = ctx.request.body;
 	const uid = ctx.session.user_id;
	if(!goods.length){
		ctx.body = {
			code: 101,
			message: '请选中商品'
		}
		return;
	}
	try{
		let saleSn;
		// 进货
		if(itemType == 1){
			saleSn = util.generateOrder('PH')
		}else{
			saleSn = util.generateOrder('PT')
		}
		
		const info = await saleModel.create(saleSn, itemType, uid)
		if(!info.id){
			ctx.body = {
				code: 101,
				message: '新增失败'
			}
			return;
		}
		
		for(let i = 0; i< goods.length; i++){
			const item = goods[i];
			const quantity =  Number(item.quantity);
			const price = Number(item.price);
			const amount = quantity * price;
			let grossProfitPrice;
			// 保存商品数据
			await saleGoodsModel.create(saleSn, item.goodsId, item.sizeId, quantity, price, amount, uid);
			// 保存库存数据
			let {number, cost_price: newCostPrice, total_price}  = await stockModel.findBySizeAndGoods(item.goodsId, item.sizeId, uid);
			
			//销售，减少库存
			if(itemType == 1){
				total_price -= newCostPrice * quantity;
				number -= quantity;
				grossProfitPrice = amount - newCostPrice * quantity;
			}else{
				/* 销售退货，要按最后一次的成本处理 */
				const { cost_price: oldCostPrice } = await businessFlowModel.findOne(item.goodsId, item.sizeId, 3, uid, null);
				total_price += oldCostPrice * quantity;
				number += quantity;
				newCostPrice = total_price / number;
				grossProfitPrice =  oldCostPrice * quantity - amount;
			}
			
			await stockModel.updateStock(total_price, newCostPrice, number, item.goodsId, item.sizeId, uid)
			
			console.log(amount, grossProfitPrice, 1111111)
			//添加库存流水数据
			if(itemType == 1){
				await businessFlowModel.create(item.goodsId, item.sizeId, 3, saleSn, price, newCostPrice, total_price, quantity, number, amount, grossProfitPrice, uid)
			}else{
				await businessFlowModel.create(item.goodsId, item.sizeId, 4, saleSn, price, newCostPrice, total_price, -quantity, number, amount, grossProfitPrice, uid)				
			}
			
		}
		let message;
		if(itemType == 1){
			message = '新增销售成功'
		}else{
			message = '销售退货成功'
		}
		ctx.body = {
			code: 200,
			data: util.filterUnderLineObj(info),
			message
		}
	}catch(e){
		console.log(e)
		ctx.body = {
			code: 101,
			message: '系统异常'
		}
	}
 }

/**
  * @description  根据订单号查看详情
  * @param 
  * @return 
  */
const saleDetail = async function(ctx) {
	const {
		saleSn 
	} = ctx.query;
	const uid = ctx.session.user_id;
	let data = await saleModel.findOne(saleSn);
	const list = await saleGoodsModel.findAll(saleSn);
	data.dataValues.goods = util.filterUnderLine(list)
	let = util.filterUnderLineObj(data);
	ctx.body = {
		code: 200,
		data: data,
		message: '请求成功'
	}
}

/**
  * @description 撤销库存
  * @param 
  * @return 
  */
const saleBackout = async function(ctx) {
	const {
		saleSn,
		itemType
	} = ctx.request.body;
	const uid = ctx.session.user_id;
	
	try{
		// 修改订单状态
		await saleModel.changeStatus(2, saleSn);
		// 撤销库存
		const data = await saleGoodsModel.findAll(saleSn)
		
		for(let i = 0; i< data.length; i++){
			const item = data[i];
			const quantity =  Number(item.quantity);
			const price = Number(item.price);
			const amount = quantity * price;
			let {number, total_price}  = await stockModel.findBySizeAndGoods(item.goods_id, item.size_id, uid);
			let { cost_price } = await businessFlowModel.findOne(item.goods_id, item.size_id, itemType == 1? 3: 4, uid, saleSn);
			if(itemType == 1){
				total_price += cost_price * quantity;
				number += quantity;
				cost_price = total_price / number;
			}else{
				total_price -= cost_price * quantity;
				number -= quantity;
				if(total_price == 0 || number == 0){
					cost_price = 0;
				}else{
					cost_price = total_price / number;
				}
			}
			
			await stockModel.updateStock(total_price, cost_price, number, item.goods_id, item.size_id, uid)
			
			// 删除流水数据
			await businessFlowModel.destroy(saleSn);
		}
		
		ctx.body = {
			code: 200,
			message: '撤销成功'
		}
	}catch(e){
		console.log(e)
		ctx.body = {
			code: 101,
			message: '系统异常'
		}
	}
	
}
module.exports = {
	saleList,
	saleAdd,
	saleDetail,
	saleBackout
}