const { Op, DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/db.js"); // 引入todolist的表结构
const storageSchema = "../schema/storage.js";
const storageGoodsSchema = "../schema/storage_goods.js";

const storageModel = require(storageSchema)(sequelize, DataTypes);
const storageGoodsModel = require(storageGoodsSchema)(sequelize, DataTypes);

// 一对多关联
storageModel.hasMany(storageGoodsModel, {
  foreignKey: "express_number",
  targetKey: "express_number",
  as: "storageGoods",
});

const findAndCountAll = async function (page, size, expressNumber, uid) {
  const where = {
    user_id: uid,
    status: {
      [Op.ne]: 3,
    },
  };
  if (expressNumber) {
    where["express_number"] = {
      [Op.like]: "%" + expressNumber + "%",
    };
  }
  return storageModel.findAndCountAll({
    where: where,
    attributes: [
      "id",
      "status",
      ["express_number", "expressNumber"],
      ["create_time", "createTime"],
      // [
      //   Sequelize.fn("SUM", Sequelize.col("storageGoods.number")),
      //   "goodsNumber",
      // ],
    ],
    include: [
      {
        //联表查询
        model: storageGoodsModel,
        as: "storageGoods",
        attributes: [],
      },
    ],
    // group: "storageGoods.express_number",
    limit: size,
    offset: size * (page - 1),
    order: [["create_time", "DESC"]],
  });
};

// 根据单号查询
const findBySn = async function (expressNumber) {
  return storageModel.findOne({
    where: {
      express_number: expressNumber,
    },
  });
};

const create = async function ({ expressNumber, uid }, t) {
  return storageModel.create(
    {
      express_number: expressNumber,
      status: 1, //1未扫描 2已扫描 3已入库
      create_time: new Date(),
      user_id: uid,
    },
    t
  );
};
const updateStatus = async function ({ expressNumber, status }, t) {
  return storageModel.update(
    {
      status,
    },
    {
      where: {
        express_number: expressNumber,
      },
      transaction: t,
    }
  );
};
module.exports = {
  create,
  findBySn,
  findAndCountAll,
  updateStatus,
};
