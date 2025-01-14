const { Op, DataTypes } = require("sequelize");
const sequelize = require("../config/db.js"); // 引入todolist的表结构
const schema = "../schema/supplier.js";

const model = require(schema)(sequelize, DataTypes);

const findAndCountAll = async function (page, size, uid) {
  return model.findAndCountAll({
    where: {
      user_id: uid,
    },
    limit: size,
    offset: size * (page - 1),
    order: [["create_time", "DESC"]],
  });
};

const findByName = async function (name, uid) {
  return model.findOne({
    where: {
      user_id: uid,
      supplier_name: name,
    },
  });
};

const findById = async function (id, uid) {
  return model.findOne({
    where: {
      user_id: uid,
      id: id,
    },
  });
};

const create = async function (supplierName, contact, uid) {
  return model.create({
    supplier_name: supplierName,
    contact: contact,
    user_id: uid,
    create_time: new Date(),
  });
};

const upload = async function (id, supplierName, contact) {
  return model.update(
    {
      supplier_name: supplierName,
      contact: contact,
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
  findByName,
  findById,
  create,
  upload,
  destroy,
};
