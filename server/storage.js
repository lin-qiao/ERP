const sequelize = require("../config/db.js"); // 引入todolist的表结构
const storageModel = require("../models/storage");
const storageGoodsModel = require("../models/storageGoods");
const util = require("../util/index");

/**
 * 签收列表
 * @param { page } 页数
 * @param { limit } 条数
 */
const storageList = async function (ctx) {
  const { page = 1, size = 10, expressNumber } = ctx.query;
  const uid = ctx.session.user_id;
  const { count, rows } = await storageModel.findAndCountAll(
    parseInt(page),
    parseInt(size),
    expressNumber,
    uid
  );
  for (let i = 0; i < rows.length; i++) {
    const totalNumberInfo = await storageGoodsModel.findCount(
      rows[i].dataValues.expressNumber
    );
    rows[i].dataValues.totalNumber = totalNumberInfo
      ? totalNumberInfo.dataValues.goodsNumber
      : "0";
  }
  const list = util.filterUnderLine(rows);
  ctx.body = {
    code: 200,
    data: list,
    total: count,
    message: "请求成功",
  };
};
/**
 * 签收详情
 * @param { expressNumber } 单号
 */
const storageDetail = async function (ctx) {
  const { expressNumber } = ctx.query;
  const detail = await storageModel.findBySn(expressNumber);

  ctx.body = {
    code: 200,
    data: detail,
    message: "请求成功",
  };
};

/**
 * 添加签收
 * @param { expressList } 单号列表
 */
const storageAdd = async function (ctx) {
  const { expressList } = ctx.request.body;
  const uid = ctx.session.user_id;

  //开始一个事务并将其保存到变量 t 中
  const t = await sequelize.transaction();
  try {
    for (let i = 0; i < expressList.length; i++) {
      const hasInfo = await storageModel.findBySn(expressList[i]);
      if (!hasInfo) {
        await storageModel.create({ expressNumber: expressList[i], uid }, t);
      }
    }
    await t.commit();
    ctx.body = {
      code: 200,
      message: "签收成功",
    };
  } catch (error) {
    await t.rollback();
    console.log(e);
    ctx.body = {
      code: 101,
      message: "系统异常",
    };
  }
};

/**
 * 添加商品
 * @param { expressNumber } 单号
 * @param { goodsList } 商品列表
 */
const storageGoodsAdd = async function (ctx) {
  const { expressNumber, goodsList } = ctx.request.body;
  const uid = ctx.session.user_id;

  //开始一个事务并将其保存到变量 t 中
  const t = await sequelize.transaction();
  try {
    await storageModel.updateStatus({ expressNumber, status: 2 }, t);
    for (let i = 0; i < goodsList.length; i++) {
      await storageGoodsModel.create(
        {
          expressNumber,
          codeNumber: goodsList[i].codeNumber,
          goodsId: goodsList[i].goodsId,
          sizeId: goodsList[i].sizeId,
          number: goodsList[i].number,
          uid,
        },
        t
      );
    }
    await t.commit();
    ctx.body = {
      code: 200,
      message: "入库成功",
    };
  } catch (error) {
    await t.rollback();
    console.log(error);
    ctx.body = {
      code: 101,
      message: "系统异常",
    };
  }
};

const storageGoodsList = async function (ctx) {
  const { expressNumber } = ctx.query;
  const { count, rows } = await storageGoodsModel.findAndCountAll(
    expressNumber
  );
  ctx.body = {
    code: 200,
    data: rows,
    total: count,
    message: "请求成功",
  };
};
module.exports = {
  storageList,
  storageDetail,
  storageAdd,
  storageGoodsAdd,
  storageGoodsList,
};
