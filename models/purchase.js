const {
	Op,
	DataTypes,
} = require("sequelize");
const sequelize = require('../config/db.js'); // 引入todolist的表结构
const purchaseSchema = '../schema/purchase.js';
const purchaseGoodsSchema = '../schema/purchase_goods.js';
const goodsSchema = '../schema/goods.js';
const sizeSchema = '../schema/size.js';
const purchaseModel = require(purchaseSchema)(sequelize, DataTypes)
const purchaseGoodsModel = require(purchaseGoodsSchema)(sequelize, DataTypes)
const goodsModel = require(goodsSchema)(sequelize, DataTypes)
const sizeModel = require(sizeSchema)(sequelize, DataTypes)
const findAndCountAll = async function(page, size, status, createTimeBegin, createTimeEnd, supplierId, itemType, uid) {
	const where = {
		'item_type': itemType,
		'status': status,
		'user_id': uid,
	}
	if(createTimeBegin && createTimeEnd){
		where['create_time'] = {
			[Op.between]: [createTimeBegin, createTimeEnd]
		}
	}
	
	if(supplierId){
		where['supplier_id'] = supplierId
	}
	
	return purchaseModel.findAndCountAll({
		where: where,
		limit: size,
		offset: size * (page - 1),
		order: [
			['create_time', 'DESC']
		]
	})
}

/**
 * @description  添加数据
 * @param purchaseSn 订单号
 * @param supplierName 供货商名称
 * @param supplierId 供货商id
 * @param status 1 采购  2撤销
 * @param itemType 1 采购  2采购退货
 * @return 
 */
const create = async function(purchaseSn, supplierName, supplierId, itemType, uid) {
	return purchaseModel.create({
		purchase_sn: purchaseSn,
		supplier_name: supplierName,
		supplier_id: supplierId,
		status: 1,
		item_type: itemType,
		create_time: new Date(),
		user_id: uid
	})
}

/**
 * @description 修改状态
 * @param   status  1采购  2撤销
 * @return 
 */
const changeStatus = async function(status, purchaseSn) {
	return purchaseModel.update({
		status: status
	}, {
		where: {
			purchase_sn: purchaseSn
		}
	})
}

/**
  * @description 根据订单号查询信息
  * @param 
  * @return 
  */
const findOne = async function(purchaseSn){
	return purchaseModel.findOne({
		where: {
			purchase_sn: purchaseSn
		}
	})
}
module.exports = {
	findAndCountAll,
	create,
	changeStatus,
	findOne
}
