const { Op, DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/db.js"); // 引入todolist的表结构
const orderSchema = "../schema/order.js";
const goodsSchema = "../schema/goods.js";
const sizeSchema = "../schema/size.js";

const orderModel = require(orderSchema)(sequelize, DataTypes);
const goodsModel = require(goodsSchema)(sequelize, DataTypes);
const sizeModel = require(sizeSchema)(sequelize, DataTypes);

orderModel.belongsTo(goodsModel, {
  foreignKey: "goods_id",
  as: "goods",
});

orderModel.belongsTo(sizeModel, {
  foreignKey: "size_id",
  as: "size",
});
/**
 * @description  查询列表
 * @param
 * @return
 */
const findAndCountAll = async function (
  page,
  size,
  orderSn,
  orderStatus,
  goodsName,
  orderStartTime,
  orderEndTime,
  deliveryStartTime,
  deliveryEndTime,
  uid
) {
  const where = {
    user_id: uid,
    order_status: {
      [Op.ne]: 4,
    },
  };
  if (goodsName) {
    where[Op.or] = [
      {
        "$goods.name$": {
          [Op.like]: "%" + goodsName + "%",
        },
      },
      {
        "$goods.good_sn$": {
          [Op.like]: "%" + goodsName + "%",
        },
      },
    ];
  }

  if (orderSn) {
    where["order_sn"] = orderSn;
  }
  if (orderStatus) {
    where["order_status"][Op.eq] = orderStatus;
  }

  if (!!orderStartTime && !!orderEndTime) {
    where["order_time"] = {
      [Op.between]: [orderStartTime, orderEndTime],
    };
  }
  if (!!deliveryStartTime && !!deliveryEndTime) {
    where["delivery_time"] = {
      [Op.between]: [deliveryStartTime, deliveryEndTime],
    };
  }
  return orderModel.findAndCountAll({
    where: where,
    attributes: [
      "id",
      ["order_sn", "orderSn"],
      ["order_type", "orderType"],
      ["goods_id", "goodsId"],
      ["size_id", "sizeId"],
      ["bid_price", "bidPrice"],
      ["transaction_price", "transactionPrice"],
      ["income_price", "incomePrice"],
      ["received_price", "receivedPrice"],
      ["profit_price", "profitprice"],
      ["actual_profit_price", "actualProfitPrice"],
      ["order_status", "orderStatus"],
      ["order_time", "orderTime"],
      ["delivery_time", "deliveryTime"],
      ["settlement_time", "settlementTime"],
      ["return_time", "returnTime"],
      ["user_id", "userId"],
      ["cost_price", "costPrice"],
      [Sequelize.col("goods.name"), "goodsName"],
      [Sequelize.col("goods.img_url"), "imgUrl"],
      [Sequelize.col("goods.good_sn"), "goodsSn"],
      [Sequelize.col("size.size_name"), "sizeName"],
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
    order: [
      ["order_time", "DESC"],
      ["id", "ASC"],
    ],
    limit: size,
    offset: size * (page - 1),
  });
};

/**
 * @description 根据订单号查询信息
 * @param
 * @return
 */
const findOne = async function (orderSn) {
  return orderModel.findOne({
    where: {
      order_sn: orderSn,
    },
  });
};

/**
 * @description 添加数据
 * @param orderSn   订单号
 * @param orderType    订单类型
 * @param goodsId  商品id
 * @param sizeId  尺码id
 * @param bidPrice  出价金额
 * @param incomePrice   收入价格
 * @param costPrice  成本
 * @param profitPrice   利润
 * @param orderStatus  订单状态 1未结算 2已结算 3已退货 4已关闭
 * @param orderTime  下单时间
 * @param deliveryTime  发货时间
 * @return
 */
const create = async function (
  {
    orderSn,
    orderType,
    goodsId,
    sizeId,
    bidPrice,
    incomePrice,
    costPrice,
    profitPrice,
    orderStatus,
    orderTime,
    deliveryTime,
    uid,
  },
  t
) {
  return orderModel.create(
    {
      order_sn: orderSn,
      order_type: orderType,
      goods_id: goodsId,
      size_id: sizeId,
      bid_price: bidPrice,
      income_price: incomePrice,
      order_status: orderStatus,
      cost_price: costPrice,
      profit_price: profitPrice,
      order_time: orderTime,
      delivery_time: deliveryTime,
      user_id: uid,
    },
    t
  );
};

/**
 * @description 修改订单
 * @param
 * @return
 */
const update = async function (
  {
    transactionPrice,
    receivedPrice,
    actualProfitPrice,
    settlementTime,
    returnTime,
    orderStatus,
    orderSn,
  },
  t
) {
  return orderModel.update(
    {
      order_status: orderStatus,
      transaction_price: transactionPrice,
      received_price: receivedPrice,
      actual_profit_price: actualProfitPrice,
      settlement_time: settlementTime,
      return_time: returnTime,
    },
    {
      where: {
        order_sn: orderSn,
      },
      transaction: t,
    }
  );
};

const sumNumber = async function ({
  goodsName,
  orderStatus,
  orderSn,
  orderStartTime,
  orderEndTime,
  deliveryStartTime,
  deliveryEndTime,
  returnStartTime,
  returnEndTime,
  notReturnStartTime,
  notReturnEndTime,
  uid,
  type,
}) {
  const where = {
    user_id: uid,
  };
  if (goodsName) {
    where[Op.or] = [
      {
        "$goods.name$": {
          [Op.like]: "%" + goodsName + "%",
        },
      },
      {
        "$goods.good_sn$": {
          [Op.like]: "%" + goodsName + "%",
        },
      },
    ];
  }
  if (orderSn) {
    where["order_sn"] = orderSn;
  }

  if (orderStatus) {
    where["order_status"] = orderStatus;
  }

  if (!!orderStartTime && !!orderEndTime) {
    where["order_time"] = {
      [Op.between]: [orderStartTime, orderEndTime],
    };
  }
  if (!!deliveryStartTime && !!deliveryEndTime) {
    where["delivery_time"] = {
      [Op.between]: [deliveryStartTime, deliveryEndTime],
    };
  }
  if (!!returnStartTime && !!returnEndTime) {
    where["return_time"] = {
      [Op.between]: [returnStartTime, returnEndTime],
    };
  }
  if (!!notReturnStartTime && !!notReturnEndTime) {
    where["return_time"] = {
      [Op.or]: {
        [Op.notBetween]: [notReturnStartTime, notReturnEndTime],
        [Op.is]: null,
      },
    };
  }

  return orderModel.sum(type, {
    where: where,
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

const findCount = async function ({
  goodsName,
  orderStatus,
  orderSn,
  orderStartTime,
  orderEndTime,
  deliveryStartTime,
  deliveryEndTime,
  uid,
}) {
  const where = {
    user_id: uid,
  };
  if (goodsName) {
    where[Op.or] = [
      {
        "$goods.name$": {
          [Op.like]: "%" + goodsName + "%",
        },
      },
      {
        "$goods.good_sn$": {
          [Op.like]: "%" + goodsName + "%",
        },
      },
    ];
  }
  if (orderSn) {
    where["order_sn"] = orderSn;
  }

  if (orderStatus) {
    where["order_status"] = orderStatus;
  }

  if (!!orderStartTime && !!orderEndTime) {
    where["order_time"] = {
      [Op.between]: [orderStartTime, orderEndTime],
    };
  }
  if (!!deliveryStartTime && !!deliveryEndTime) {
    where["delivery_time"] = {
      [Op.between]: [deliveryStartTime, deliveryEndTime],
    };
  }
  return orderModel.count({
    where: where,
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

const destroy = async function (orderSn) {
  return orderModel.destroy({
    where: {
      order_sn: {
        [Op.or]: orderSn.split(","),
      },
    },
  });
};

module.exports = {
  create,
  findOne,
  findAndCountAll,
  update,
  sumNumber,
  findCount,
  destroy,
};
