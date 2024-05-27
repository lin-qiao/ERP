const brandModel = require("../models/brand");

/**
 * 品牌列表
 * @param { page } 页数
 * @param { size } 条数
 */
const brandList = async function (ctx) {
  const { ids, page = 1, size = 10 } = ctx.query;
  const uid = ctx.session.user_id;
  const { count, rows } = await brandModel.findAndCountAll(
    parseInt(page),
    parseInt(size),
    ids,
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
 * 新增品牌
 * @param { brandName } 品牌名称
 */
const brandAdd = async function (ctx) {
  const { brandName } = ctx.request.body;
  const uid = ctx.session.user_id;
  if (!brandName) {
    ctx.body = {
      code: 101,
      message: "品牌名称不能为空",
    };
    return;
  }
  const hasInfo = await brandModel.findByName(brandName, uid);
  if (hasInfo) {
    ctx.body = {
      code: 101,
      message: "该品牌已存在",
    };
    return;
  }
  const info = await brandModel.create(brandName, uid);
  if (info.id) {
    ctx.body = {
      code: 200,
      message: "新增成功",
    };
  } else {
    ctx.body = {
      code: 101,
      message: "新增失败",
    };
  }
};

/**
 * 修改品牌
 * @param { brandName } 品牌名称
 * @param { id } 品牌id
 */
const brandUpdate = async function (ctx) {
  const { brandName, id } = ctx.request.body;
  if (!id) {
    ctx.body = {
      code: 101,
      message: "品牌id不能为空",
    };
    return;
  }
  if (!brandName) {
    ctx.body = {
      code: 101,
      message: "品牌名称不能为空",
    };
    return;
  }

  const info = await brandModel.upload(id, brandName);
  if (info[0]) {
    ctx.body = {
      code: 200,
      message: "修改成功",
    };
  } else {
    ctx.body = {
      code: 101,
      message: "修改失败",
    };
  }
};

/**
 * 删除品牌
 * @param { id } 品牌id
 */
const brandDelete = async function (ctx) {
  const { id } = ctx.request.body;
  if (!id) {
    ctx.body = {
      code: 101,
      message: "品牌id不能为空",
    };
    return;
  }

  const num = await brandModel.destroy(id);
  if (num == 1) {
    ctx.body = {
      code: 200,
      message: "删除成功",
    };
  } else {
    ctx.body = {
      code: 101,
      message: "删除失败",
    };
  }
};
module.exports = {
  brandList,
  brandAdd,
  brandUpdate,
  brandDelete,
};
