const sequelize = require("../config/db.js"); // 引入todolist的表结构
const saleModel = require("../models/sale");
const saleGoodsModel = require("../models/saleGoods");
const businessFlowModel = require("../models/businessFlow");
const stockModel = require("../models/stock");
const goodsModel = require("../models/goods");
const sizeModel = require("../models/size");
const util = require("../util/index");
/**
 * 销售列表
 * @param { page } 页数
 * @param { limit } 条数
 * @param { status } 1销售 2撤销
 */
const saleList = async function (ctx) {
  const {
    page = 1,
    size = 10,
    status = 1,
    itemType = 1,
    createTimeBegin = "",
    createTimeEnd = "",
  } = ctx.query;
  const uid = ctx.session.user_id;
  const data = await saleModel.findAll(
    parseInt(page),
    parseInt(size),
    status,
    createTimeBegin,
    createTimeEnd,
    itemType,
    uid
  );
  const count = await saleModel.findCount(
    status,
    createTimeBegin,
    createTimeEnd,
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
 * @description 新增销售
 * @param itemType	1销售 2退货
 * @param goods	商品列表
 * @return
 */

const saleAdd = async function (ctx) {
  const { itemType, goods } = ctx.request.body;
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
    let saleSn =
      itemType == 1 ? util.generateOrder("PH") : util.generateOrder("PT");

    const info = await saleModel.create(
      {
        saleSn,
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
      // 保存商品数据
      await saleGoodsModel.create(
        {
          saleSn,
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
      let {
        number,
        cost_price: newCostPrice,
        total_price: totalPrice,
      } = await stockModel.findBySizeAndGoods(item.goodsId, item.sizeId, uid);

      let oldCostPrice, grossProfitPrice;
      //销售，减少库存
      if (itemType == 1) {
        //防止出现 2位小数不准确的问题
        if (number == quantity) {
          totalPrice = 0;
          number = 0;
        } else {
          totalPrice -= newCostPrice * quantity;
          number -= quantity;
        }
        grossProfitPrice = amount - newCostPrice * quantity;
      } else {
        /* 销售退货，要按最后一次的成本处理 */
        ({ cost_price: oldCostPrice } = await businessFlowModel.findOne(
          item.goodsId,
          item.sizeId,
          3,
          uid,
          null
        ));
        totalPrice += oldCostPrice * quantity;
        number += quantity;
        newCostPrice = totalPrice / number;
        grossProfitPrice = oldCostPrice * quantity - amount;
      }

      //添加库存流水
      const flowData = {
        goodsId: item.goodsId,
        sizeId: item.sizeId,
        flowType: itemType == 1 ? 3 : 4,
        businessSn: saleSn,
        businessPrice: price,
        costPrice: itemType == 1 ? newCostPrice : oldCostPrice,
        totalPrice: totalPrice,
        number: itemType == 1 ? quantity : -quantity,
        numberStored: number,
        totalBusinessPrice: amount,
        grossProfitPrice: grossProfitPrice,
        uid: uid,
      };

      await businessFlowModel.create(flowData, {
        transaction: t,
      });

      // 如果number = 0;  当前商品售空， 成本单价变为0
      await stockModel.updateStock(
        {
          totalPrice,
          costPrice: number > 0 ? newCostPrice : 0,
          number,
          goodsId: item.goodsId,
          sizeId: item.sizeId,
          uid,
        },
        t
      );
    }
    //都保存成功则提交
    await t.commit();
    let message = itemType == 1 ? "新增销售成功" : "销售退货成功";
    ctx.body = {
      code: 200,
      data: util.filterUnderLineObj(info),
      message,
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

/**
 * @description 新增批量销售
 * @param itemType	1销售 2退货
 * @param goods	商品列表
 * @return
 */

const saleBatchAdd = async function (ctx) {
  const { itemType, goods } = ctx.request.body;
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
    let saleSn =
      itemType == 1 ? util.generateOrder("PH") : util.generateOrder("PT");

    const info = await saleModel.create(
      {
        saleSn,
        itemType,
        uid,
      },
      {
        transaction: t,
      }
    );

    for (let i = 0; i < goods.length; i++) {
      const item = goods[i];
      const goodInfo = await goodsModel.findByGoodsSn(item.goodsSn, uid);
      const sizeInfo = await sizeModel.findByName(item.sizeName, uid);
      const quantity = Number(item.quantity);
      const price = Number(item.price);
      const amount = quantity * price;
      // 保存商品数据
      await saleGoodsModel.create(
        {
          saleSn,
          goodsId: goodInfo.id,
          sizeId: sizeInfo.id,
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
      let {
        number,
        cost_price: newCostPrice,
        total_price: totalPrice,
      } = await stockModel.findBySizeAndGoods(goodInfo.id, sizeInfo.id, uid);
      console.log(number, quantity);
      let oldCostPrice, grossProfitPrice;
      //销售，减少库存
      if (itemType == 1) {
        //防止出现 2位小数不准确的问题
        if (number == quantity) {
          totalPrice = 0;
          number = 0;
        } else {
          totalPrice -= newCostPrice * quantity;
          number -= quantity;
        }
        grossProfitPrice = amount - newCostPrice * quantity;
      } else {
        /* 销售退货，要按最后一次的成本处理 */
        ({ cost_price: oldCostPrice } = await businessFlowModel.findOne(
          goodInfo.id,
          sizeInfo.id,
          3,
          uid,
          null
        ));
        totalPrice += oldCostPrice * quantity;
        number += quantity;
        newCostPrice = totalPrice / number;
        grossProfitPrice = oldCostPrice * quantity - amount;
      }

      //添加库存流水
      const flowData = {
        goodsId: goodInfo.id,
        sizeId: sizeInfo.id,
        flowType: itemType == 1 ? 3 : 4,
        businessSn: saleSn,
        businessPrice: price,
        costPrice: itemType == 1 ? newCostPrice : oldCostPrice,
        totalPrice: totalPrice,
        number: itemType == 1 ? quantity : -quantity,
        numberStored: number,
        totalBusinessPrice: amount,
        grossProfitPrice: grossProfitPrice,
        uid: uid,
      };

      await businessFlowModel.create(flowData, {
        transaction: t,
      });
      console.log(111111111111111111111111111, number);
      // 如果number = 0;  当前商品售空， 成本单价变为0
      if (number < 0) {
        throw new Error(item.goodsName + item.sizeName + "库存错误，请核对");
      }

      await stockModel.updateStock(
        {
          totalPrice,
          costPrice: number > 0 ? newCostPrice : 0,
          number,
          goodsId: goodInfo.id,
          sizeId: sizeInfo.id,
          uid,
        },
        t
      );
    }
    //都保存成功则提交
    await t.commit();
    let message = itemType == 1 ? "新增销售成功" : "销售退货成功";
    ctx.body = {
      code: 200,
      data: util.filterUnderLineObj(info),
      message,
    };
  } catch (e) {
    await t.rollback();
    console.log(e.message);
    ctx.body = {
      code: 101,
      message: e.message,
    };
  }
};
/**
 * @description  根据订单号查看详情
 * @param
 * @return
 */
const saleDetail = async function (ctx) {
  const { saleSn } = ctx.query;
  const uid = ctx.session.user_id;
  let data = await saleModel.findOne(saleSn);
  const list = await saleGoodsModel.findAll(saleSn);
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
const saleBackout = async function (ctx) {
  const { saleSn, itemType } = ctx.request.body;
  const uid = ctx.session.user_id;

  //开始一个事务并将其保存到变量 t 中
  const t = await sequelize.transaction();
  try {
    // 撤销库存
    const data = await saleGoodsModel.findAll(saleSn);

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const quantity = Number(item.quantity);
      const price = Number(item.price);
      const amount = quantity * price;
      let { number, total_price: totalPrice } =
        await stockModel.findBySizeAndGoods(item.goods_id, item.size_id, uid);
      let { cost_price: costPrice } = await businessFlowModel.findOne(
        item.goods_id,
        item.size_id,
        itemType == 1 ? 3 : 4,
        uid,
        saleSn
      );
      if (itemType == 1) {
        totalPrice += costPrice * quantity;
        number += quantity;
        costPrice = totalPrice / number;
      } else {
        totalPrice -= costPrice * quantity;
        number -= quantity;
        if (totalPrice == 0 || number == 0) {
          costPrice = 0;
        } else {
          costPrice = totalPrice / number;
        }
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
        t
      );
    }
    // 修改订单状态
    await saleModel.changeStatus(
      {
        status: 2,
        saleSn,
      },
      t
    );

    //修改流水状态
    await businessFlowModel.updateStatus(
      {
        businessSn: saleSn,
      },
      t
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
  saleList,
  saleAdd,
  saleDetail,
  saleBackout,
  saleBatchAdd,
};
