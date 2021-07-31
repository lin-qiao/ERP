const purchaseModel = require('../models/purchase');
const purchaseGoodsModel = require('../models/purchaseGoods');
const businessFlowModel = require('../models/businessFlow');
const stockModel = require('../models/stock');
const util = require('../util/index');
/**
 * 采购列表
 * @param { page } 页数
 * @param { limit } 条数
 * @param { status } 1采购 2撤销
 */
const purchaseList = async function(ctx) {
	const {
		page = 1, 
		size = 10, 
		status = 1,
		itemType = 1,
		createTimeBegin = '', 
		createTimeEnd = '', 
		supplierId = '', 
	} = ctx.query;
	const uid = ctx.session.user_id;
	const {
		count,
		rows
	} = await purchaseModel.findAndCountAll(parseInt(page), parseInt(size), status, createTimeBegin, createTimeEnd, supplierId, itemType, uid)

	const list = util.filterUnderLine(rows)
	ctx.body = {
		code: 200,
		data: list,
		total: count,
		message: '请求成功'
	}
}

/**
  * @description 新增采购
  * @param supplierName 供货商名称
  * @param supplierId	供货商id
  * @param itemType	1采购 2退货
  * @param goods	商品列表
  * @return 
  */
 
 const purchaseAdd = async function(ctx) {
 	const {
 		supplierName, 
		supplierId,
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
		let purchaseSn;
		// 进货
		if(itemType == 1){
			purchaseSn = util.generateOrder('JH')
		}else{
			purchaseSn = util.generateOrder('JT')
		}
		
		const info = await purchaseModel.create(purchaseSn, supplierName, supplierId, itemType, uid)
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
			// 保存商品数据
			await purchaseGoodsModel.create(purchaseSn, item.goodsId, item.sizeId, quantity, price, amount, uid);
			// 保存库存数据
			let {number, cost_price, total_price}  = await stockModel.findBySizeAndGoods(item.goodsId, item.sizeId, uid);
			
			if(itemType == 1){
				total_price += amount;
				number += quantity;
				cost_price = total_price / number;
			}else{
				total_price -= amount;
				number -= quantity;
				if(total_price == 0 || number == 0){
					cost_price = 0;
				}else{
					cost_price = total_price / number;
				}
			}
			
			
			
			await stockModel.updateStock(total_price, cost_price, number, item.goodsId, item.sizeId, uid)
			//添加库存流水数据
			if(itemType == 1){
				await businessFlowModel.create(item.goodsId, item.sizeId, 1, purchaseSn, price, cost_price, total_price, quantity, number, amount, 0, uid)
			}else{
				await businessFlowModel.create(item.goodsId, item.sizeId, 2, purchaseSn, price, cost_price, total_price, -quantity, number, amount, 0, uid)				
			}
			
		}
		let message;
		if(itemType == 1){
			message = '新增采购成功'
		}else{
			message = '采购退货成功'
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
const purchaseDetail = async function(ctx) {
	const {
		purchaseSn 
	} = ctx.query;
	const uid = ctx.session.user_id;
	let data = await purchaseModel.findOne(purchaseSn);
	const list = await purchaseGoodsModel.findAll(purchaseSn);
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
const purchaseBackout = async function(ctx) {
	const {
		purchaseSn,
		itemType
	} = ctx.request.body;
	const uid = ctx.session.user_id;
	
	try{
		// 修改订单状态
		await purchaseModel.changeStatus(2, purchaseSn);
		// 撤销库存
		const data = await purchaseGoodsModel.findAll(purchaseSn)
		
		for(let i = 0; i< data.length; i++){
			const item = data[i];
			const quantity =  Number(item.quantity);
			const price = Number(item.price);
			const amount = quantity * price;
			let {number, cost_price, total_price}  = await stockModel.findBySizeAndGoods(item.goods_id, item.size_id, uid);
			
			
			if(itemType == 1){
				total_price -= amount;
				number -= quantity;
				// 如果总价为0,均价直接为0  防止0/0 报错
				if(total_price == 0 || number == 0){
					cost_price = 0;
				}else{
					cost_price = total_price / number;
				}
			}else{
				total_price += amount;
				number += quantity;
				cost_price = total_price / number;
			}
			await stockModel.updateStock(total_price, cost_price, number, item.goods_id, item.size_id, uid)
			
			// 删除流水数据
			await businessFlowModel.destroy(purchaseSn);
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
	purchaseList,
	purchaseAdd,
	purchaseDetail,
	purchaseBackout
}