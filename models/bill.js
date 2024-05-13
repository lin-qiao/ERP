const {
	Op,
	DataTypes,
	Sequelize,
} = require("sequelize");
const sequelize = require('../config/db.js'); // 引入todolist的表结构
const billschema = '../schema/bill.js';
const billGoodsSchema = '../schema/bill_goods.js';
const billGoodsModel = require(billGoodsSchema)(sequelize, DataTypes)
const billModel = require(billschema)(sequelize, DataTypes)
billModel.hasMany(billGoodsModel, {
	foreignKey: 'bill_sn',
	sourceKey: 'bill_sn',
	as: 'billGoods'
})

const findAll = async function(page, size, status, createTimeBegin, createTimeEnd, uid) {
	const where = {
		'status': status,
		'user_id': uid,
	}
	if(createTimeBegin && createTimeEnd){
		where['create_time'] = {
			[Op.between]: [createTimeBegin, createTimeEnd]
		}
	}

	return billModel.findAll({
		where: where,
		attributes: [
			'id',
			'status',
			'remark',
			['bill_sn', 'billSn'],
			['create_time', 'createTime'],
			[Sequelize.fn('SUM', Sequelize.col('billGoods.total_price')), 'totalPrice'],
			[Sequelize.fn('SUM', Sequelize.col('billGoods.total')), 'total'],
		],
		include: [
			{
		
				model: billGoodsModel,
				as: 'billGoods',
				attributes: [],
				duplicating:false,
			},
		
		],
		group: 'id',
		limit: size,
		offset: size * (page - 1),
		order: [
			['create_time', 'DESC']
		]
	})
}
/**
  * @description获取商品总数
  * @param 
  * @return 
  */

const findCount = async(status, createTimeBegin, createTimeEnd , uid) => {
	const where = {
		'status': status,
		'user_id': uid,
	}
	if(createTimeBegin && createTimeEnd){
		where['create_time'] = {
			[Op.between]: [createTimeBegin, createTimeEnd]
		}
	}
	
	return billModel.count({
		where: where
	})
} 
/**
 * @description  添加数据
 * @param billSn 订单号
 * @param status 1 添加  2撤销
 * @return 
 */
const create = async function({
	billSn,
	remark,
	uid
}, t) {
	return billModel.create({
		bill_sn: billSn,
		remark: remark,
		status: 1,
		create_time: new Date(),
		user_id: uid
	}, t)
}

/**
 * @description 根据订单号查询信息
 * @param 
 * @return 
 */
const findOne = async function(billSn) {
	return billModel.findOne({
		where: {
			bill_sn: billSn
		},
		attributes: [
			'id',
			'status',
			'remark',
			['bill_sn', 'billSn'],
			['create_time', 'createTime'],
			[Sequelize.fn('SUM', Sequelize.col('billGoods.total_price')), 'totalPrice'],
			[Sequelize.fn('SUM', Sequelize.col('billGoods.total')), 'total'],
		],
		include: [{

				model: billGoodsModel,
				as: 'billGoods',
				attributes: [],
				duplicating: false,
			},

		],
		group: 'id',
	})
}

/**
 * @description 修改状态
 * @param   status  1采购  2撤销
 * @return 
 */
const changeStatus = async function(billSn, status) {
	return billModel.update({
		status: status
	}, {
		where: {
			bill_sn: billSn
		}
	})
}

module.exports = {
	findAll,
	findCount,
	create,
	findOne,
	changeStatus
}