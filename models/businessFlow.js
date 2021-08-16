const {
	Op,
	DataTypes,
	Sequelize
} = require("sequelize");
const sequelize = require('../config/db.js'); // 引入todolist的表结构
const businessFlowSchema = '../schema/business_flow.js';
const goodsSchema = '../schema/goods.js';
const sizeSchema = '../schema/size.js';
const date = require('../util/date.js');
const businessFlowModel = require(businessFlowSchema)(sequelize, DataTypes)
const goodsModel = require(goodsSchema)(sequelize, DataTypes)
const sizeModel = require(sizeSchema)(sequelize, DataTypes)
businessFlowModel.belongsTo(goodsModel, {
	foreignKey: 'goods_id',
	as: 'goods'
});
businessFlowModel.belongsTo(sizeModel, {
	foreignKey: 'size_id',
	as: 'size'
});
const findAndCountAll = async function(page, size, goodsId, sizeId, createTimeBegin, createTimeEnd, uid, flowType = '') {
	const where = {
		'user_id': uid
	}
	
	if (goodsId) {
		where['goods_id'] = goodsId;
	}
	if (sizeId) {
		where['size_id'] = sizeId;
	}
	
	if(!!createTimeBegin && !!createTimeEnd){
		where['create_time'] = {
			[Op.between]: [createTimeBegin, createTimeEnd]
		}
	}
	
	if(flowType) {
		switch (flowType){
			case 'sale':
				where['flow_type'] = {
					[Op.or]: [3, 4]
				};
				break;
			case 'purchase':
				where['flow_type'] = {
					[Op.or]: [1, 2]
				};
				break;
		}
	}
	return businessFlowModel.findAndCountAll({
		where: where,
		attributes: [
			'id',
			'number',
			['business_price', 'businessPrice'],
			['business_sn', 'businessSn'],
			['cost_price', 'costPrice'],
			['create_time', 'createTime'],
			['flow_type', 'flowType'],
			['goods_id', 'goodsId'],
			['gross_profit_price', 'grossProfitPrice'],
			['number_stored', 'numberStored'],
			['size_id', 'sizeId'],
			['total_business_price', 'totalBusinessPrice'],
			['total_price', 'totalPrice'],
			['user_id', 'userId'],
			[Sequelize.col('goods.name'), 'goodsName'],
			[Sequelize.col('goods.img_url'), 'imgUrl'],
			[Sequelize.col('goods.good_sn'), 'goodsSn'],
			[Sequelize.col('size.size_name'), 'sizeName'],
		],
		include: [
			{
				model: goodsModel,
				as:'goods',
				attributes: [],
			},{
				model: sizeModel,
				as:'size',
				attributes: [],
			},
		],
		order:[
			['create_time', 'DESC'],
		],
		limit: size,
		offset: size * (page - 1)
	})
}

/**
  * @description 添加数据
  * @param goodsId   商品id
  * @param sizeId    尺码id
  * @param flowType  1、采购 2、采购退货 3、销售  4、销售退货
  * @param businessSn  订单号
  * @param businessPrice  业务单价
  * @param costPrice   库存成本单价
  * @param totalPrice  库存总价
  * @param number  库存增加数量
  * @param number_stored  库存总数
  * @return 
  */
const create = async function(goodsId, sizeId, flowType, businessSn, businessPrice, costPrice, totalPrice, number, numberStored, totalBusinessPrice, grossProfitPrice, uid) {
	return businessFlowModel.create({
		'goods_id': goodsId,
		'size_id': sizeId,
		'flow_type': flowType,
		'business_sn': businessSn,
		'business_price': businessPrice,
		'cost_price': costPrice,
		'total_price': totalPrice,
		'number': number,
		'number_stored': numberStored,
		'user_id': uid,
		'gross_profit_price':grossProfitPrice,
		'total_business_price':totalBusinessPrice,
		'create_time': new Date()
	})
}

/**
  * @description 删除数据
  * @param 
  * @return 
  */

const destroy = async function(businessSn) {
	return businessFlowModel.destroy({
		where: {
			'business_sn': businessSn,
		}
	})
}

/**
  * @description  根据商品id 和尺码id 获取最后一条销售的流水
  * @param 
  * @return 
  */
const findOne = async function(goodsId, sizeId, flowType, uid, businessSn){
	const where = {
		'user_id': uid,
		'goods_id': goodsId,
		'size_id': sizeId,
		'flow_type': flowType
	}
	if(businessSn){
		where['business_sn'] = businessSn;
	}
	return businessFlowModel.findOne({
		where: where,
		order:[
			['create_time', 'DESC'],
		],
	})
}
/**
  * @description 统计单品数量
  * @param 
  * @return 
  */
 
const sumNumber = async function(flowType, uid, type, createTimeBegin, createTimeEnd ) {
	const where = {
		'user_id': uid,
	}
	if(!!createTimeBegin && !!createTimeEnd){
		where['create_time'] = {
			[Op.between]: [createTimeBegin, createTimeEnd]
		}
	}
	
	if(flowType) {
		where['flow_type'] = flowType;
	}
	if(type == 'number'){
		return businessFlowModel.sum('number', {
			where: where
		})
	}else if(type == 'totalBusinessPrice'){
		return businessFlowModel.sum('total_business_price', {
			where: where
		})
	}else if(type == 'grossProfitPrice'){
		return businessFlowModel.sum('gross_profit_price', {
			where: where
		})
	}else if(type == 'totalPrice'){
		return businessFlowModel.sum('total_price', {
			where: where
		})
	}
}

module.exports = {
	findAndCountAll,
	create,
	destroy,
	findOne,
	sumNumber
}