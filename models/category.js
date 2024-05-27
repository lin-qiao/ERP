const { Op, DataTypes } = require("sequelize");
const sequelize = require("../config/db.js"); // 引入todolist的表结构
const schema = "../schema/category.js";

const model = require(schema)(sequelize, DataTypes);

const findAndCountAll = async function (page, size, uid) {
  return model.findAndCountAll({
    where: {
      user_id: uid,
    },
    limit: size,
    offset: size * (page - 1),
  });
};
const findByName = async function (name, uid) {
  return model.findOne({
    where: {
      user_id: uid,
      category_name: name,
    },
  });
};
const create = async function (categoryName, brandIds, uid) {
  return model.create({
    category_name: categoryName,
    brand_ids: brandIds,
    user_id: uid,
    create_time: new Date(),
  });
};

const upload = async function (id, categoryName, brandIds) {
  return model.update(
    {
      category_name: categoryName,
      brand_ids: brandIds,
      create_time: new Date(),
    },
    {
      where: {
        id,
      },
    }
  );
};

const destroy = async function (id) {
  return model.destroy({
    where: {
      id,
    },
  });
};

module.exports = {
  findAndCountAll,
  create,
  findByName,
  upload,
  destroy,
};
