const sequelize = require("../config/db.js"); // 引入todolist的表结构
const goodsModel = require("../models/goods");
const sizeModel = require("../models/size");
const brandModel = require("../models/brand");
const stockModel = require("../models/stock");
const sign = require("../util/sign");
const axios = require("axios");
const config = require("../config/index");
const util = require("../util/index");
const { app_key } = require("../config/index.js");
/**
 * 商品列表
 * @param { page } 页数
 * @param { limit } 条数
 */
const goodsList = async function (ctx) {
  const { page = 1, size = 10, name = "", brandId = "" } = ctx.query;
  const uid = ctx.session.user_id;
  const { count, rows } = await goodsModel.findAndCountAll(
    parseInt(page),
    parseInt(size),
    name,
    brandId,
    uid
  );

  for (let i = 0; i < rows.length; i++) {
    rows[i].dataValues.brandName = rows[i].brand.dataValues.brandName;
    if (rows[i].size_ids) {
      const sizeInfo = await sizeModel.findByIds(rows[i].size_ids, uid);
      rows[i].dataValues.sizeNames = util.filterUnderLine(sizeInfo);
    }
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
 * 根据货号获取商品信息
 * @param { code } 商品货号
 */
const getGoodsBySn = async function (ctx) {
  const { code } = ctx.query;

  const params = {
    app_key: app_key,
    timestamp: new Date().getTime(),
    article_numbers: [code],
  };
  params.sign = sign(params);
  const { data } = await axios.post(
    "https://openapi.dewu.com/dop/api/v1/spu/batch_article_number",
    params
  );

  let list =
    data.data && data.data.length
      ? data.data.map((item) => ({
          title: item.title,
          articleNumber: item.article_number,
          logoUrl: item.spu_logo,
        }))
      : [];
  ctx.body = {
    code: 200,
    message: "成功",
    data: list,
  };
};
/**
 * 根据条形码获取商品信息
 * @param { code } 商品条形码
 */
const getGoodsByCode = async function (ctx) {
  const { code } = ctx.query;
  const uid = ctx.session.user_id;

  const info = await stockModel.findByCode(code, uid);
  ctx.body = {
    code: 200,
    message: "成功",
    data: info,
  };
};

/**
 * 新增商品
 * @param { name } 商品名称
 * @param { goodSn } 商品货号
 * @param { imgUrl } 商品图片
 * @param { brandId } 商品品牌id
 * @param { sizeIds } 商品尺码ids
 * @param { purchasePrice } 商品采购价
 */
const goodsAdd = async function (ctx) {
  const { name, goodSn, imgUrl, brandId, sizeIds, purchasePrice } =
    ctx.request.body;
  const uid = ctx.session.user_id;
  if (!name) {
    ctx.body = {
      code: 101,
      message: "商品名称不能为空",
    };
    return;
  }
  if (!goodSn) {
    ctx.body = {
      code: 101,
      message: "商品货号不能为空",
    };
    return;
  }
  if (!sizeIds) {
    ctx.body = {
      code: 101,
      message: "商品尺码不能为空",
    };
    return;
  }

  const hasInfo = await goodsModel.findByGoodsSn(goodSn, uid);
  if (hasInfo) {
    ctx.body = {
      code: 101,
      message: "该商品已存在",
    };
    return;
  }
  const info = await goodsModel.create(
    name,
    goodSn,
    imgUrl,
    brandId,
    sizeIds,
    purchasePrice,
    uid
  );

  if (!info.id) {
    ctx.body = {
      code: 101,
      message: "新增失败",
    };
    return;
  }

  // 添加库存
  let sizeIdList = sizeIds.split(",");
  sizeIdList = sizeIdList.map((item) => ({
    goods_id: info.id,
    size_id: item,
    number: 0,
    cost_price: 0,
    total_price: 0,
    update_time: new Date(),
    user_id: uid,
  }));

  const stockInfo = await stockModel.bulkCreate(sizeIdList);

  if (!stockInfo.length) {
    ctx.body = {
      code: 101,
      message: "新增失败",
    };
  }
  ctx.body = {
    code: 200,
    message: "新增成功",
  };
};

/**
 * 修改商品
 * @param { id } id
 * @param { name } 商品名称
 * @param { goodSn } 商品货号
 * @param { imgUrl } 商品图片
 * @param { brandId } 商品品牌id
 * @param { sizeIds } 商品尺码ids
 * @param { codeList } 条码列表
 * @param { purchasePrice } 商品采购价
 */
const goodsUpdate = async function (ctx) {
  const {
    id,
    name,
    goodSn,
    imgUrl,
    brandId,
    sizeIds,
    codeList,
    purchasePrice,
  } = ctx.request.body;
  const uid = ctx.session.user_id;
  if (!id) {
    ctx.body = {
      code: 101,
      message: "商品id不能为空",
    };
    return;
  }
  if (!name) {
    ctx.body = {
      code: 101,
      message: "商品名称不能为空",
    };
    return;
  }
  if (!goodSn) {
    ctx.body = {
      code: 101,
      message: "商品货号不能为空",
    };
    return;
  }
  if (!sizeIds) {
    ctx.body = {
      code: 101,
      message: "商品尺码不能为空",
    };
    return;
  }

  //开始一个事务并将其保存到变量 t 中
  const t = await sequelize.transaction();

  try {
    const { size_ids: oldSizeIds } = await goodsModel.findByGoodsId(id);

    const info = await goodsModel.update(
      { id, name, goodSn, imgUrl, brandId, sizeIds, purchasePrice },
      t
    );

    //修改库存表
    let sizeIdList = sizeIds.split(","),
      oldSizeIdList = oldSizeIds.split(",");
    // //id一样，不做修改
    // if (sizeIdList.sort().toString() == oldSizeIdList.sort().toString()) {
    //   ctx.body = {
    //     code: 200,
    //     message: "修改成功",
    //   };
    //   return;
    // }
    // 要加的要减 的
    const addList = util.findManyArr(sizeIdList, oldSizeIdList);
    const reduceList = util.findManyArr(oldSizeIdList, sizeIdList);
    if (addList.length) {
      console.log(id);
      const sizeIdList = addList.map((item) => ({
        goods_id: id,
        size_id: item,
        number: 0,
        cost_price: 0,
        total_price: 0,
        update_time: new Date(),
        user_id: uid,
      }));
      const stockInfo = await stockModel.bulkCreate(sizeIdList);
    }

    if (reduceList.length) {
      for (let i = 0; i < reduceList.length; i++) {
        const item = reduceList[i];
        await stockModel.destroy(
          { goodsId: id, sizeId: item, uid },
          {
            transaction: t,
          }
        );
      }
    }

    if (codeList && codeList.length) {
      codeList.forEach(async (item) => {
        await stockModel.updateCodeNumber(
          {
            codeNumber: item.codeNumber,
            goodsId: id,
            sizeId: item.sizeId,
            uid,
          },
          t
        );
      });
    }

    await t.commit();
    ctx.body = {
      code: 200,
      message: "修改成功",
    };
  } catch (e) {
    await t.rollback();
    ctx.body = {
      code: 101,
      message: e,
    };
  }
};

/**
 * 删除商品
 * @param { id } id
 */
const goodsDelete = async function (ctx) {
  const { id } = ctx.request.body;
  const uid = ctx.session.user_id;
  if (!id) {
    ctx.body = {
      code: 101,
      message: "商品id不能为空",
    };
    return;
  }

  try {
    // 查询是否还有库存
    const sum = await stockModel.sumStock(id, uid);
    if (sum) {
      ctx.body = {
        code: 101,
        message: "当前库存不为0，无法删除",
      };
    }
    // 删除商品表
    await goodsModel.destroy(id);
    await stockModel.destroyByGoodsId(
      { goodsId: id, uid },
      {
        transaction: t,
      }
    );
    ctx.body = {
      code: 200,
      message: "删除成功",
    };
  } catch (e) {
    ctx.body = {
      code: 101,
      message: e,
    };
  }
};
module.exports = {
  goodsList,
  goodsAdd,
  goodsUpdate,
  goodsDelete,
  getGoodsBySn,
  getGoodsByCode,
};
