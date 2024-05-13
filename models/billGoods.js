const {
	Op,
	DataTypes,
	Sequelize,
} = require("sequelize");
const sequelize = require('../config/db.js'); // 引入todolist的表结构
const billGoodsSchema = '../schema/bill_goods.js';

const billGoodsModel = require(billGoodsSchema)(sequelize, DataTypes)

/**
 * @description 根据订单号查询
 * @param 
 * @return 
 */
const findAll = async function(billSn) {
	return billGoodsModel.findAll({
		where: {
			'bill_sn': billSn,
		},
	})
}

/**
 * @description  添加数据
 * @param billSn 订单号
 * @param goodsId 商品id
 * @param sizeId 尺码id
 * @param quantity  数量
 * @param price   价格
 * @param amount 总价 
 * @return 
 */
const create = async function({billSn, goodsId, goodsName, goodsImg, total,  price, totalPrice, uid}, t) {
	return billGoodsModel.create({
		'bill_sn': billSn,
		'goods_id': goodsId,
		'goods_name': goodsName,
		'goods_img': goodsImg,
		'total': total,
		'price': price,
		'total_price': totalPrice,
		'user_id': uid,
		create_time: new Date()
	}, t)
}


module.exports = {
	create,
	findAll,
}
