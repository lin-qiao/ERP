const sequelize = require("../config/db.js"); // 引入todolist的表结构
const purchaseModel = require("../models/purchase");
const purchaseGoodsModel = require("../models/purchaseGoods");
const businessFlowModel = require("../models/businessFlow");
const storageModel = require("../models/storage");
const stockModel = require("../models/stock");
const util = require("../util/index");
/**
 * 采购列表
 * @param { page } 页数
 * @param { limit } 条数
 * @param { status } 1采购 2撤销
 */
const purchaseList = async function (ctx) {
  const {
    page = 1,
    size = 10,
    status = 1,
    itemType = 1,
    createTimeBegin = "",
    createTimeEnd = "",
    supplierId = "",
  } = ctx.query;
  const uid = ctx.session.user_id;
  const data = await purchaseModel.findAll(
    parseInt(page),
    parseInt(size),
    status,
    createTimeBegin,
    createTimeEnd,
    supplierId,
    itemType,
    uid
  );
  const count = await purchaseModel.findCount(
    status,
    createTimeBegin,
    createTimeEnd,
    supplierId,
    itemType,
    uid
  );

  ctx.body = {
    code: 200,
    data: data,
    total: count,
    message: "请求成功",
  };
};

/**
 * @description 新增采购
 * @param supplierName 供货商名称
 * @param supplierId	供货商id
 * @param itemType	1采购 2退货
 * @param goods	商品列表
 * @return
 */

const purchaseAdd = async function (ctx) {
  const { supplierName, supplierId, itemType, goods, expressNumber } =
    ctx.request.body;
  const uid = ctx.session.user_id;
  if (!goods.length) {
    ctx.body = {
      code: 101,
      message: "请选中商品",
    };
    return;
  }

  //开始一个事务并将其保存到变量 t 中
  const t = await sequelize.transaction();
  try {
    let purchaseSn =
      itemType == 1 ? util.generateOrder("JH") : util.generateOrder("JT");
    const info = await purchaseModel.create(
      {
        purchaseSn,
        supplierName,
        supplierId,
        itemType,
        uid,
      },
      {
        transaction: t,
      }
    );

    for (let i = 0; i < goods.length; i++) {
      const item = goods[i];
      const quantity = Number(item.quantity);
      const price = Number(item.price);
      const amount = quantity * price;

      let {
        number, //库存
        cost_price: costPrice, //单价
        total_price: totalPrice, //总价
      } = await stockModel.findBySizeAndGoods(item.goodsId, item.sizeId, uid);
      if (itemType == 1) {
        totalPrice += amount;
        number += quantity;
        costPrice = totalPrice / number;
      } else {
        totalPrice -= amount;
        number -= quantity;
        if (totalPrice == 0 || number == 0) {
          costPrice = 0;
        } else {
          costPrice = totalPrice / number;
        }
      }

      // 保存商品数据
      await purchaseGoodsModel.create(
        {
          purchaseSn,
          goodsId: item.goodsId,
          sizeId: item.sizeId,
          quantity,
          price,
          amount,
          uid,
        },
        {
          transaction: t,
        }
      );

      // 保存库存数据
      await stockModel.updateStock(
        {
          totalPrice,
          costPrice,
          number,
          goodsId: item.goodsId,
          sizeId: item.sizeId,
          uid,
        },
        {
          transaction: t,
        }
      );

      //添加库存流水数据
      const flowData = {
        goodsId: item.goodsId,
        sizeId: item.sizeId,
        flowType: itemType == 1 ? 1 : 2,
        businessSn: purchaseSn,
        businessPrice: price,
        costPrice: costPrice,
        totalPrice: totalPrice,
        number: itemType == 1 ? quantity : -quantity,
        numberStored: number,
        totalBusinessPrice: amount,
        grossProfitPrice: 0,
        uid: uid,
      };
      await businessFlowModel.create(flowData, {
        transaction: t,
      });
    }

    if (itemType == 1 && expressNumber) {
      await storageModel.updateStatus({ expressNumber, status: 3 }, t);
    }

    //都保存成功则提交
    await t.commit();
    let message = itemType == 1 ? "新增采购成功" : "采购退货成功";
    ctx.body = {
      code: 200,
      data: util.filterUnderLineObj(info),
      message,
    };
  } catch (e) {
    console.log(e);
    await t.rollback();
    ctx.body = {
      code: 101,
      message: "系统异常",
    };
  }
};

/**
 * @description  根据订单号查看详情
 * @param
 * @return
 */
const purchaseDetail = async function (ctx) {
  const { purchaseSn } = ctx.query;
  const uid = ctx.session.user_id;
  let data = await purchaseModel.findOne(purchaseSn);
  const list = await purchaseGoodsModel.findAll(purchaseSn);
  data.dataValues.goods = util.filterUnderLine(list);
  let = util.filterUnderLineObj(data);
  ctx.body = {
    code: 200,
    data: data,
    message: "请求成功",
  };
};

/**
 * @description 撤销库存
 * @param
 * @return
 */
const purchaseBackout = async function (ctx) {
  const { purchaseSn, itemType } = ctx.request.body;
  const uid = ctx.session.user_id;

  //开始一个事务并将其保存到变量 t 中
  const t = await sequelize.transaction();
  try {
    // 撤销库存
    const data = await purchaseGoodsModel.findAll(purchaseSn);

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const quantity = Number(item.quantity);
      const price = Number(item.price);
      const amount = quantity * price;
      let {
        number,
        cost_price: costPrice,
        total_price: totalPrice,
      } = await stockModel.findBySizeAndGoods(item.goods_id, item.size_id, uid);

      if (itemType == 1) {
        totalPrice -= amount;
        number -= quantity;
        // 如果总价为0,均价直接为0  防止0/0 报错
        if (totalPrice == 0 || number == 0) {
          costPrice = 0;
        } else {
          costPrice = totalPrice / number;
        }
      } else {
        totalPrice += amount;
        number += quantity;
        costPrice = totalPrice / number;
      }
      await stockModel.updateStock(
        {
          totalPrice,
          costPrice,
          number,
          goodsId: item.goods_id,
          sizeId: item.size_id,
          uid,
        },
        {
          transaction: t,
        }
      );
    }

    // 修改订单状态
    await purchaseModel.changeStatus(
      {
        status: 2,
        purchaseSn,
      },
      {
        transaction: t,
      }
    );

    //修改流水状态
    await businessFlowModel.updateStatus(
      {
        businessSn: purchaseSn,
      },
      {
        transaction: t,
      }
    );

    await t.commit();
    ctx.body = {
      code: 200,
      message: "撤销成功",
    };
  } catch (e) {
    await t.rollback();
    console.log(e);
    ctx.body = {
      code: 101,
      message: "系统异常",
    };
  }
};
module.exports = {
  purchaseList,
  purchaseAdd,
  purchaseDetail,
  purchaseBackout,
};
