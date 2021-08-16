const {
	Op,
	DataTypes,
	Sequelize
} = require("sequelize");
const sequelize = require('../config/db.js'); // 引入todolist的表结构
const saleSchema = '../schema/sale.js';
const saleGoodsSchema = '../schema/sale_goods.js';
const goodsSchema = '../schema/goods.js';
const sizeSchema = '../schema/size.js';
const saleModel = require(saleSchema)(sequelize, DataTypes)
const saleGoodsModel = require(saleGoodsSchema)(sequelize, DataTypes)
const goodsModel = require(goodsSchema)(sequelize, DataTypes)
const sizeModel = require(sizeSchema)(sequelize, DataTypes)

saleModel.hasMany(saleGoodsModel, {
	foreignKey: 'sale_sn',
	sourceKey: 'sale_sn',
	as: 'saleGoods'
})
const findAll = async function(page, size, status, createTimeBegin, createTimeEnd, itemType, uid) {
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
	
	return saleModel.findAll({
		where: where,
		attributes: [
			'id',
			'status',
			['sale_sn', 'saleSn'],
			['item_type', 'itemType'],
			['create_time', 'createTime'],
			[Sequelize.fn('SUM', Sequelize.col('saleGoods.quantity')), 'totalNumber'],
			[Sequelize.fn('SUM', Sequelize.col('saleGoods.amount')), 'totalPrice'],
		],
		include: [
			{
		
				model: saleGoodsModel,
				as: 'saleGoods',
				attributes: [],
				duplicating:false,
			},
		
		],
		group: 'id',
		order: [
			['create_time', 'DESC']
		],
		limit: size,
		offset: size * (page - 1)
	})
}

/**
  * @description获取商品总数
  * @param 
  * @return 
  */

const findCount = async(status, createTimeBegin, createTimeEnd, itemType, uid) => {
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
	
	return saleModel.count({
		where: where
	})
} 
/**
 * @description  添加数据
 * @param saleSn 订单号
 * @param status 1 采购  2撤销
 * @param itemType 1 采购  2采购退货
 * @return 
 */
const create = async function(saleSn, itemType, uid) {
	return saleModel.create({
		sale_sn: saleSn,
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
const changeStatus = async function(status, saleSn) {
	return saleModel.update({
		status: status
	}, {
		where: {
			sale_sn: saleSn
		}
	})
}

/**
  * @description 根据订单号查询信息
  * @param 
  * @return 
  */
const findOne = async function(saleSn){
	return saleModel.findOne({
		where: {
			sale_sn: saleSn
		},
		attributes: [
			'id',
			'status',
			['sale_sn', 'saleSn'],
			['item_type', 'itemType'],
			['create_time', 'createTime'],
			[Sequelize.fn('SUM', Sequelize.col('saleGoods.quantity')), 'totalNumber'],
			[Sequelize.fn('SUM', Sequelize.col('saleGoods.amount')), 'totalPrice'],
		],
		include: [
			{
		
				model: saleGoodsModel,
				as: 'saleGoods',
				attributes: [],
				duplicating:false,
			},
		
		],
		group: 'id',
	})
}
module.exports = {
	findAll,
	findCount,
	create,
	changeStatus,
	findOne
}
