const sequelize = require("../config/db.js"); // 引入todolist的表结构
const orderModel = require("../models/order");
const businessFlowModel = require("../models/businessFlow");
const stockModel = require("../models/stock");
const goodsModel = require("../models/goods");
const sizeModel = require("../models/size");
const util = require("../util/index");
const date = require("../util/date.js");

/**
 * @description 订单列表
 * @param { page } 页数
 * @param { limit } 条数
 * @param { orderSn } 订单号
 * @param { orderStatus } 订单状态
 * @param { goodsName } 商品名称
 * @param { orderStartTime } 订单开始时间
 * @param { ordeEndTime } 订单结束时间
 * @return
 */
const orderList = async function (ctx) {
  let {
    page = 1,
    size = 10,
    orderSn = "",
    orderStatus = "",
    goodsName = "",
    orderStartTime = "",
    orderEndTime = "",
    deliveryStartTime = "",
    deliveryEndTime = "",
  } = ctx.query;
  const uid = ctx.session.user_id;
  if (orderStartTime && orderEndTime) {
    orderStartTime = orderStartTime + " 00:00:00";
    orderEndTime = orderEndTime + " 23:59:59";
  }
  if (deliveryStartTime && deliveryEndTime) {
    deliveryStartTime = deliveryStartTime + " 00:00:00";
    deliveryEndTime = deliveryEndTime + " 23:59:59";
  }

  const { count, rows } = await orderModel.findAndCountAll(
    parseInt(page),
    parseInt(size),
    orderSn,
    orderStatus,
    goodsName,
    orderStartTime,
    orderEndTime,
    deliveryStartTime,
    deliveryEndTime,
    uid
  );

  ctx.body = {
    code: 200,
    data: rows,
    total: count,
    message: "请求成功",
  };
};

/**
 * @description 导入订单
 * @param orderList	订单列表
 * @return
 */
const orderExport = async function (ctx) {
  const { orderList } = ctx.request.body;
  const uid = ctx.session.user_id;
  if (!orderList.length) {
    ctx.body = {
      code: 101,
      message: "请先导入订单",
    };
    return;
  }

  //开始一个事务并将其保存到变量 t 中
  const t = await sequelize.transaction();
  try {
    let num = 0;
    for (let i = 0; i < orderList.length; i++) {
      const item = orderList[i];
      if (!item.deliveryTime) {
        throw new Error(
          "第" +
            (i + 1) +
            "行" +
            item.goodsName +
            item.sizeName +
            " 未发货，发货后在导入"
        );
      }
      const orderInfo = await orderModel.findOne(item.orderSn);
      if (orderInfo) {
        continue;
      }
      const goodInfo = await goodsModel.findByGoodsSn(item.goodsSn, uid);
      console.log(item.goodsName, goodInfo);
      if (!goodInfo) {
        throw new Error(
          "第" +
            (i + 1) +
            "行" +
            item.goodsName +
            item.sizeName +
            " 商品信息未录入"
        );
      }
      const sizeInfo = await sizeModel.findByName(item.sizeName, uid);
      if (!sizeInfo) {
        throw new Error(
          "第" +
            (i + 1) +
            "行" +
            item.goodsName +
            item.sizeName +
            " 尺码信息未录入"
        );
      }
      const stockInfo = await stockModel.findBySizeAndGoods(
        goodInfo.id,
        sizeInfo.id,
        uid,
        t
      );
      if (!stockInfo) {
        throw new Error(
          "第" +
            (i + 1) +
            "行" +
            item.goodsName +
            item.sizeName +
            " 未找到库存信息"
        );
      } else if (stockInfo.number <= 0) {
        throw new Error(
          "第" +
            (i + 1) +
            "行" +
            item.goodsName +
            item.sizeName +
            " 库存还未录入"
        );
      }
      // 保存订单数据
      await orderModel.create(
        {
          orderSn: item.orderSn,
          orderType: item.orderType,
          goodsId: goodInfo.id,
          sizeId: sizeInfo.id,
          bidPrice: item.bidPrice,
          incomePrice: item.incomePrice,
          costPrice: stockInfo.cost_price,
          profitPrice: item.incomePrice - stockInfo.cost_price,
          orderStatus: 1,
          orderTime: item.orderTime,
          deliveryTime: item.deliveryTime,
          uid,
        },
        {
          transaction: t,
        }
      );
      num++;
    }
    await t.commit();
    ctx.body = {
      code: 200,
      message: "导入成功" + num + "条数据",
    };
  } catch (e) {
    await t.rollback();
    console.log(e);
    ctx.body = {
      code: 101,
      message: e.message,
    };
  }
};

/**
 * @description 批量修改订单
 * @param orderList	订单列表
 * @return
 */

const betchOrderEdit = async function (ctx) {
  const { orderList } = ctx.request.body;
  const uid = ctx.session.user_id;
  if (!orderList.length) {
    ctx.body = {
      code: 101,
      message: "请先导入订单",
    };
    return;
  }

  //开始一个事务并将其保存到变量 t 中
  const t = await sequelize.transaction();
  try {
    for (let i = 0; i < orderList.length; i++) {
      const item = orderList[i];
      const orderInfo = await orderModel.findOne(item.orderSn);
      if (!orderInfo) {
        throw new Error(
          "第" +
            (i + 1) +
            "行" +
            item.orderSn +
            item.goodsName +
            item.sizeName +
            " 订单信息未录入"
        );
      }
      //已结算或撤销的订单，不要重复结算
      if (orderInfo.order_status !== 1) {
        continue;
      }

      if (item.orderStatus === "已撤销") {
        await orderModel.update(
          {
            transactionPrice: item.transactionPrice,
            receivedPrice: 0,
            actualProfitPrice: 0,
            settlementTime: item.settlementTime,
            returnTime: item.returnTime || null,
            orderStatus: 3,
            orderSn: item.orderSn,
          },
          t
        );
      } else if (item.orderStatus === "已结算") {
        await orderModel.update(
          {
            transactionPrice: item.transactionPrice,
            receivedPrice: item.receivedPrice,
            actualProfitPrice: item.receivedPrice - orderInfo.cost_price,
            settlementTime: item.settlementTime,
            returnTime: item.returnTime || null,
            orderStatus: 2,
            orderSn: item.orderSn,
          },
          t
        );

        let {
          number,
          cost_price: costPrice,
          total_price: totalPrice,
        } = await stockModel.findBySizeAndGoods(
          orderInfo.goods_id,
          orderInfo.size_id,
          uid,
          t
        );
        if (number <= 0) {
          throw new Error(
            "第" +
              (i + 1) +
              "行" +
              item.goodsName +
              item.sizeName +
              " 剩余库存不足"
          );
        }

        //添加库存流水
        const flowData = {
          goodsId: orderInfo.goods_id,
          sizeId: orderInfo.size_id,
          flowType: 3,
          businessSn: orderInfo.order_sn,
          businessPrice: orderInfo.income_price,
          totalBusinessPrice: orderInfo.income_price,
          costPrice: costPrice,
          totalPrice:
            totalPrice - orderInfo.income_price + orderInfo.profit_price,
          number: 1,
          numberStored: number - 1,
          grossProfitPrice: orderInfo.profit_price,
          createTime: orderInfo.order_time,
          uid: uid,
        };

        await businessFlowModel.create(flowData, {
          transaction: t,
        });

        if (number != 1) {
          //减少库存数据
          await stockModel.decrementStock(
            {
              costPrice: orderInfo.income_price - orderInfo.profit_price,
              number: 1,
              goodsId: orderInfo.goods_id,
              sizeId: orderInfo.size_id,
              uid,
            },
            t
          );
        } else {
          //库存等于1时，重置为0
          await stockModel.updateStock(
            {
              totalPrice: 0,
              costPrice: 0,
              number: 0,
              goodsId: orderInfo.goods_id,
              sizeId: orderInfo.size_id,
              uid,
            },
            t
          );
        }
      }
    }
    await t.commit();
    ctx.body = {
      code: 200,
      message: "导入成功",
    };
  } catch (e) {
    await t.rollback();
    console.log(e);
    ctx.body = {
      code: 101,
      message: e.message,
    };
  }
};

/**
 * 订单统计
 */
const orderCount = async function (ctx) {
  let {
    goodsName,
    orderStatus,
    orderSn,
    orderStartTime,
    orderEndTime,
    deliveryStartTime,
    deliveryEndTime,
  } = ctx.query;
  const uid = ctx.session.user_id;

  if (orderStartTime && orderEndTime) {
    orderStartTime = orderStartTime + " 00:00:00";
    orderEndTime = orderEndTime + " 23:59:59";
  }
  if (deliveryStartTime && deliveryEndTime) {
    deliveryStartTime = deliveryStartTime + " 00:00:00";
    deliveryEndTime = deliveryEndTime + " 23:59:59";
  }

  try {
    //未结算订单数
    const unsettledNum =
      (await orderModel.findCount({
        goodsName,
        orderStatus: "1",
        orderSn,
        orderStartTime,
        orderEndTime,
        deliveryStartTime,
        deliveryEndTime,
        uid,
      })) || 0;
    //已结算订单数
    const settledNum =
      (await orderModel.findCount({
        goodsName,
        orderStatus: "2",
        orderSn,
        orderStartTime,
        orderEndTime,
        deliveryStartTime,
        deliveryEndTime,
        uid,
      })) || 0;

    //未结算销售价格
    const unsettledBidPrice =
      (await orderModel.sumNumber({
        goodsName,
        orderStatus: "1",
        orderSn,
        orderStartTime,
        orderEndTime,
        deliveryStartTime,
        deliveryEndTime,
        uid,
        type: "bid_price",
      })) || 0;

    //已结算销售价格
    const settledBidPrice =
      (await orderModel.sumNumber({
        goodsName,
        orderStatus: "2",
        orderSn,
        orderStartTime,
        orderEndTime,
        deliveryStartTime,
        deliveryEndTime,
        uid,
        type: "transaction_price",
      })) || 0;
    //未结算价格
    const unsettledPrice =
      (await orderModel.sumNumber({
        goodsName,
        orderStatus: "1",
        orderSn,
        orderStartTime,
        orderEndTime,
        deliveryStartTime,
        deliveryEndTime,
        uid,
        type: "income_price",
      })) || 0;
    //已结算价格
    const settledPrice =
      (await orderModel.sumNumber({
        goodsName,
        orderStatus: "2",
        orderSn,
        orderStartTime,
        orderEndTime,
        deliveryStartTime,
        deliveryEndTime,
        uid,
        type: "received_price",
      })) || 0;
    //未结算利润
    const unsettledProfitPrice =
      (await orderModel.sumNumber({
        goodsName,
        orderStatus: "1",
        orderSn,
        orderStartTime,
        orderEndTime,
        deliveryStartTime,
        deliveryEndTime,
        uid,
        type: "profit_price",
      })) || 0;
    //已结算利润
    const settledProfitPrice =
      (await orderModel.sumNumber({
        goodsName,
        orderStatus: "2",
        orderSn,
        orderStartTime,
        orderEndTime,
        deliveryStartTime,
        deliveryEndTime,
        uid,
        type: "actual_profit_price",
      })) || 0;
    //已结算成本
    const costPrice =
      (await orderModel.sumNumber({
        goodsName,
        orderStatus: "2",
        orderSn,
        orderStartTime,
        orderEndTime,
        deliveryStartTime,
        deliveryEndTime,
        uid,
        type: "cost_price",
      })) || 0;
    //利润率
    const grossProfitRate =
      Math.round((settledProfitPrice / costPrice) * 10000) / 100;
    ctx.body = {
      code: 200,
      data: {
        unsettledNum,
        settledNum,
        unsettledPrice,
        settledPrice,
        unsettledProfitPrice,
        settledProfitPrice,
        unsettledBidPrice,
        settledBidPrice,
        grossProfitRate,
      },
      message: "请求成功",
    };
  } catch (e) {
    console.log(e);
    ctx.body = {
      code: 101,
      message: "系统异常",
    };
  }
};

/**
 * 税务统计
 */
const taxFilingCount = async function (ctx) {
  let { startTime, endTime } = ctx.query;
  const uid = ctx.session.user_id;

  try {
    if (!startTime || !endTime) {
      throw new Error("请先选择月份");
    }
    startTime = date.getQuarterStartDate(startTime) + " 00:00:00";
    endTime = date.getQuarterEndDate(endTime) + " 23:59:59";
    console.log(startTime, endTime);
    // 总销售额
    const allTransactionPrice =
      (await orderModel.sumNumber({
        orderStatus: [1, 2, 3],
        deliveryStartTime: startTime,
        deliveryEndTime: endTime,
        uid,
        type: "transaction_price",
      })) || 0;

    //退货销售额
    const returnTransactionPrice =
      (await orderModel.sumNumber({
        orderStatus: 3,
        returnStartTime: startTime,
        returnEndTime: endTime,
        uid,
        type: "transaction_price",
      })) || 0;
    //销售额
    const transactionPrice = allTransactionPrice - returnTransactionPrice;

    // 总成本
    const allCostPrice =
      (await orderModel.sumNumber({
        orderStatus: [1, 2, 3],
        deliveryStartTime: startTime,
        deliveryEndTime: endTime,
        uid,
        type: "cost_price",
      })) || 0;
    // 退货退款成本
    const returnCostPrice =
      (await orderModel.sumNumber({
        orderStatus: 3,
        returnStartTime: startTime,
        returnEndTime: endTime,
        uid,
        type: "cost_price",
      })) || 0;
    // 成本
    const costPrice = allCostPrice - returnCostPrice;
    //销售利润
    const profitPrice =
      (await orderModel.sumNumber({
        orderStatus: [1, 2, 3],
        deliveryStartTime: startTime,
        deliveryEndTime: endTime,
        uid,
        type: "actual_profit_price",
      })) || 0;
    //利润率
    const grossProfitRate = Math.round((profitPrice / costPrice) * 10000) / 100;

    ctx.body = {
      code: 200,
      data: {
        allTransactionPrice,
        returnTransactionPrice,
        transactionPrice,
        allCostPrice,
        profitPrice,
        costPrice,
        returnCostPrice,
        grossProfitRate,
      },
      message: "请求成功",
    };
  } catch (e) {
    console.log(e);
    ctx.body = {
      code: 101,
      message: e.message,
    };
  }
};

/**
 * 删除订单
 * @param { orderSn } 订单号，逗号隔开
 */
const orderDel = async function (ctx) {
  const { orderSn } = ctx.request.query;
  const uid = ctx.session.user_id;

  try {
    if (!orderSn) {
      throw new Error("请先选择订单");
    }

    const res = await orderModel.destroy(orderSn);
    console.log(res);
    ctx.body = {
      code: 200,
      message: "删除成功",
    };
  } catch (e) {
    ctx.body = {
      code: 101,
      message: e.message,
    };
  }
};
module.exports = {
  orderExport,
  orderList,
  betchOrderEdit,
  orderCount,
  taxFilingCount,
  orderDel,
};
