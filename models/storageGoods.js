const { Op, DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/db.js"); // 引入todolist的表结构
const storageGoodsSchema = "../schema/storage_goods.js";
const goodsSchema = "../schema/goods.js";
const sizeSchema = "../schema/size.js";
const storageGoodsModel = require(storageGoodsSchema)(sequelize, DataTypes);
const sizeModel = require(sizeSchema)(sequelize, DataTypes);
const goodsModel = require(goodsSchema)(sequelize, DataTypes);

storageGoodsModel.belongsTo(goodsModel, {
  foreignKey: "goods_id",
  as: "goods",
});
storageGoodsModel.belongsTo(sizeModel, {
  foreignKey: "size_id",
  as: "size",
});
/**
 * @description获取商品列表
 * @param
 * @return
 */
const findAndCountAll = async (expressNumber) => {
  return storageGoodsModel.findAndCountAll({
    where: {
      express_number: expressNumber,
    },
    attributes: [
      "id",
      "number",
      ["code_number", "codeNumber"],
      [Sequelize.col("goods.id"), "goodsId"],
      [Sequelize.col("goods.name"), "goodsName"],
      [Sequelize.col("goods.img_url"), "goodsImg"],
      [Sequelize.col("goods.good_sn"), "goodsSn"],
      [Sequelize.col("size.size_name"), "sizeName"],
      [Sequelize.col("size.id"), "sizeId"],
    ],
    include: [
      {
        model: goodsModel,
        as: "goods",
        attributes: [],
      },
      {
        model: sizeModel,
        as: "size",
        attributes: [],
      },
    ],
  });
};

/**
 * @description获取商品总数
 * @param
 * @return
 */
const findCount = async (expressNumber) => {
  return storageGoodsModel.findOne({
    where: {
      express_number: expressNumber,
    },
    attributes: [[Sequelize.fn("SUM", Sequelize.col("number")), "goodsNumber"]],
    group: "express_number",
  });
};

const create = async function (
  { expressNumber, codeNumber, goodsId, sizeId, number, uid },
  t
) {
  return storageGoodsModel.create(
    {
      express_number: expressNumber,
      code_number: codeNumber,
      goods_id: goodsId,
      size_id: sizeId,
      number: number,
      create_time: new Date(),
      user_id: uid,
    },
    t
  );
};
module.exports = {
  findAndCountAll,
  findCount,
  create,
};
