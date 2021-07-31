const {
	Op,
	DataTypes,
	Sequelize,
} = require("sequelize");
const sequelize = require('../config/db.js'); // 引入todolist的表结构
const purchaseGoodsSchema = '../schema/purchase_goods.js';
const goodsSchema = '../schema/goods.js';
const sizeSchema = '../schema/size.js';
const purchaseGoodsModel = require(purchaseGoodsSchema)(sequelize, DataTypes)
const goodsModel = require(goodsSchema)(sequelize, DataTypes)
const sizeModel = require(sizeSchema)(sequelize, DataTypes)


purchaseGoodsModel.belongsTo(goodsModel, {
	foreignKey: 'goods_id',
	as: 'goods'
});

purchaseGoodsModel.belongsTo(sizeModel, {
	foreignKey: 'size_id',
	as: 'sizes'
});

/**
 * @description 根据订单号查询
 * @param 
 * @return 
 */
const findAll = async function(purchaseSn) {
	return purchaseGoodsModel.findAll({
		where: {
			'purchase_sn': purchaseSn,
		},
		attributes: [
			'amount',
			'goods_id',
			'id',
			'price',
			'purchase_sn',
			'quantity',
			'size_id',
			[Sequelize.col('goods.name'), 'goodsName'],
			[Sequelize.col('goods.good_sn'), 'goodsSn'],
			[Sequelize.col('sizes.size_name'), 'sizeName'],
		],
		include: [{ //联表查询 
			model: goodsModel,
			as: 'goods',
			attributes: []
		}, {
			model: sizeModel,
			as: 'sizes',
			attributes: []
		}],
	})
}
/**
 * @description  添加数据
 * @param purchaseSn 订单号
 * @param goodsId 商品id
 * @param sizeId 尺码id
 * @param quantity  数量
 * @param price   价格
 * @param amount 总价 
 * @return 
 */
const create = async function(purchaseSn, goodsId, sizeId, quantity, price, amount, uid) {
	return purchaseGoodsModel.create({
		'purchase_sn': purchaseSn,
		'goods_id': goodsId,
		'size_id': sizeId,
		'quantity': quantity,
		'price': price,
		'amount': amount,
		'user_id': uid,
		create_time: new Date()
	})
}


module.exports = {
	create,
	findAll,
}
