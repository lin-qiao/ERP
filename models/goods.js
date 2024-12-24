const { Op, DataTypes } = require("sequelize");
const sequelize = require("../config/db.js"); // 引入todolist的表结构
const goodsSchema = "../schema/goods.js";
const brandSchema = "../schema/brand.js";
const goodsModel = require(goodsSchema)(sequelize, DataTypes);
const brandModel = require(brandSchema)(sequelize, DataTypes);

goodsModel.belongsTo(brandModel, {
  foreignKey: "brand_id",
});

const findAndCountAll = async function (page, size, name, brandId, uid) {
  const where = {
    user_id: uid,
  };

  if (name) {
    where[Op.or] = [
      {
        name: {
          [Op.like]: "%" + name + "%",
        },
      },
      {
        good_sn: {
          [Op.like]: "%" + name + "%",
        },
      },
    ];
  }
  if (brandId) {
    where["brand_id"] = brandId;
  }

  return goodsModel.findAndCountAll({
    where: where,
    include: [
      {
        //联表查询
        model: brandModel,
        attributes: [["brand_name", "brandName"]],
      },
    ],
    limit: size,
    offset: size * (page - 1),
    order: [["create_time", "DESC"]],
  });
};

const findByGoodsSn = async function (goodSn, uid) {
  return goodsModel.findOne({
    where: {
      user_id: uid,
      good_sn: goodSn,
    },
  });
};

const findByGoodsId = async function (id) {
  return goodsModel.findOne({
    where: {
      id,
    },
  });
};

const create = async function (
  name,
  goodSn,
  imgUrl,
  brandId,
  sizeIds,
  purchasePrice,
  uid
) {
  return goodsModel.create({
    name,
    good_sn: goodSn,
    img_url: imgUrl,
    brand_id: brandId,
    size_ids: sizeIds,
    purchase_price: purchasePrice,
    create_time: new Date(),
    user_id: uid,
  });
};

const update = async function (
  { id, name, goodSn, imgUrl, brandId, sizeIds, purchasePrice },
  t
) {
  return goodsModel.update(
    {
      name,
      good_sn: goodSn,
      img_url: imgUrl,
      brand_id: brandId,
      size_ids: sizeIds,
      purchase_price: purchasePrice,
      create_time: new Date(),
    },
    {
      where: {
        id,
      },
    },
    t
  );
};

const destroy = async function (id) {
  return goodsModel.destroy({
    where: {
      id,
    },
  });
};

module.exports = {
  findAndCountAll,
  findByGoodsSn,
  findByGoodsId,
  create,
  update,
  destroy,
};
