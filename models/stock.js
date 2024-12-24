const { Op, DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/db.js"); // 引入todolist的表结构
const goodsSchema = "../schema/goods.js";
const stockSchema = "../schema/stock.js";
const sizeSchema = "../schema/size.js";
const brandSchema = "../schema/brand.js";
const goodsModel = require(goodsSchema)(sequelize, DataTypes);
const stockModel = require(stockSchema)(sequelize, DataTypes);
const sizeModel = require(sizeSchema)(sequelize, DataTypes);
const brandModel = require(brandSchema)(sequelize, DataTypes);

stockModel.belongsTo(sizeModel, {
  foreignKey: "size_id",
  as: "sizes",
});
stockModel.belongsTo(goodsModel, {
  foreignKey: "goods_id",
  as: "goods",
});
goodsModel.belongsTo(brandModel, {
  foreignKey: "brand_id",
  as: "brand",
});

// 一对多关联
goodsModel.belongsTo(stockModel, {
  foreignKey: "id",
  targetKey: "goods_id",
  as: "stock",
});
/**
 * @description 检索当前用户库存
 * @param
 * @return
 */
const findAndCountAll = async (page, size, goodSn, brandId, uid, order) => {
  const where = {
    user_id: uid,
  };

  if (goodSn) {
    where["good_sn"] = goodSn;
  }
  if (brandId) {
    where["brand_id"] = brandId;
  }
  return goodsModel.findAndCountAll({
    where: where,
    attributes: [
      ["name", "goodsName"],
      ["id", "goodsId"],
      ["brand_id", "brandId"],
      ["good_sn", "goodsSn"],
      ["img_url", "imgUrl"],
      ["name", "goodsName"],
      [Sequelize.col("brand.brand_name"), "brandName"],
      [Sequelize.col("stock.cost_price"), "costPrice"],
      [
        Sequelize.literal("`stock`.`cost_price` * `stock`.`number`"),
        "totalCostPrice",
      ],
      [Sequelize.col("stock.number"), "number"],
      [Sequelize.col("stock.size_id"), "sizeId"],
      [Sequelize.col("stock.sizes.size_name"), "sizeName"],
    ],
    include: [
      {
        model: stockModel,
        as: "stock",
        include: [
          {
            model: sizeModel,
            as: "sizes",
            attributes: [],
          },
        ],
      },
      {
        model: brandModel,
        as: "brand",
        attributes: [],
      },
    ],
    order: order ? Sequelize.literal(order) : null,
    limit: size,
    offset: size * (page - 1),
  });
};

/**
 * @description 根据商品id 检索库存
 * @param
 * @return
 */

const findByGoodsId = async function (goodsId, uid) {
  return stockModel.findAll({
    attributes: [
      ["cost_price", "costPrice"],
      ["total_price", "totalPrice"],
      "number",
      ["code_number", "codeNumber"],
      [Sequelize.col("sizes.size_name"), "sizeName"],
      [Sequelize.col("sizes.id"), "sizeId"],
    ],
    where: {
      goods_id: goodsId,
      user_id: uid,
    },
    order: Sequelize.literal("`sizeName` ASC"),
    include: [
      {
        model: sizeModel,
        as: "sizes",
        attributes: [],
      },
    ],
  });
};
/**
 * @description 根据尺码和商品id检索
 * @param
 * @return
 */
const findBySizeAndGoods = async function (goodsId, sizeId, uid) {
  return stockModel.findOne({
    where: {
      goods_id: goodsId,
      size_id: sizeId,
      user_id: uid,
    },
  });
};
/**
 * @description 根据条形码检索
 * @param
 * @return
 */
const findByCode = async function (codeNumber, uid) {
  return stockModel.findOne({
    where: {
      code_number: {
        [Op.like]: "%" + codeNumber + "%",
      },
      user_id: uid,
    },
    attributes: [
      ["code_number", "codeNumber"],
      [Sequelize.col("sizes.size_name"), "sizeName"],
      [Sequelize.col("sizes.id"), "sizeId"],
      [Sequelize.col("goods.id"), "goodsId"],
      [Sequelize.col("goods.name"), "goodsName"],
      [Sequelize.col("goods.good_sn"), "goodsSn"],
      [Sequelize.col("goods.img_url"), "goodsImg"],
    ],
    include: [
      {
        model: goodsModel,
        as: "goods",
        attributes: [],
      },
      {
        model: sizeModel,
        as: "sizes",
        attributes: [],
      },
    ],
  });
};

/**
 * @description  根据尺码id 批量检索
 * @param
 * @return
 */

const findBySizeIds = async function (ids, goodsId, uid) {
  const idList = ids.split(",");
  return stockModel.findAll({
    where: {
      goods_id: goodsId,
      user_id: uid,
      size_id: {
        [Op.or]: idList,
      },
    },
  });
};

/**
 * @description 批量添加库存数据
 * @param
 * @return
 */
const bulkCreate = async function (list) {
  return stockModel.bulkCreate(list);
};

/**
 * @description 添加库存数据
 * @param
 * @return
 */
const create = async function (
  { goodsId, sizeId, number, costPrice, totalPrice, uid },
  t
) {
  return stockModel.create(
    {
      goods_id: goodsId,
      size_id: sizeId,
      number: number,
      cost_price: costPrice,
      total_price: totalPrice,
      user_id: uid,
      update_time: new Date(),
    },
    t
  );
};

/**
 * @description 根据商品id删除
 * @param
 * @return
 */

const destroyByGoodsId = async function ({ goodsId, uid }, t) {
  return stockModel.destroy({
    where: {
      goods_id: goodsId,
      user_id: uid,
    },
  });
};

/**
 * @description 删除
 * @param
 * @return
 */

const destroy = async function (goodsId, sizeId, uid) {
  return stockModel.destroy(
    {
      where: {
        goods_id: goodsId,
        size_id: sizeId,
        user_id: uid,
      },
    },
    t
  );
};

/**
 * @description 查询当前商品库存总和
 * @param
 * @return
 */

const sumStock = async function (goodsId, uid) {
  return stockModel.sum("number", {
    where: {
      goods_id: goodsId,
      user_id: uid,
    },
  });
};

/**
 * @description 更改库存数据
 * @param
 * @return
 */
const updateStock = async function (
  { totalPrice, costPrice, number, goodsId, sizeId, uid },
  t
) {
  return stockModel.update(
    {
      total_price: totalPrice,
      cost_price: costPrice,
      number: number,
    },
    {
      where: {
        size_id: sizeId,
        goods_id: goodsId,
        user_id: uid,
      },
    },
    t
  );
};

/**
 * @description 获取当前用户库存总数
 * @param
 * @return
 */

const sumNumber = async function (uid) {
  return stockModel.sum("number", {
    where: {
      user_id: uid,
    },
  });
};

/**
 * @description 获取当前用户成本总数
 * @param
 * @return
 */

const sumCostPrice = async function (uid) {
  return stockModel.sum("total_price", {
    where: {
      user_id: uid,
    },
  });
};
/**
 * @description 更改条形码数据
 * @param
 * @return
 */
const updateCodeNumber = async function (
  { codeNumber, goodsId, sizeId, uid },
  t
) {
  console.log(codeNumber, goodsId, sizeId, uid);
  return stockModel.update(
    {
      code_number: codeNumber,
    },
    {
      where: {
        size_id: sizeId,
        goods_id: goodsId,
        user_id: uid,
      },
    },
    t
  );
};

module.exports = {
  findBySizeAndGoods,
  findBySizeIds,
  bulkCreate,
  create,
  findByGoodsId,
  destroyByGoodsId,
  destroy,
  sumStock,
  findAndCountAll,
  updateStock,
  sumNumber,
  sumCostPrice,
  updateCodeNumber,
  findByCode,
};
