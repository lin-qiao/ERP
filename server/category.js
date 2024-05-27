const categoryModel = require("../models/category");
const brandModel = require("../models/brand");
const util = require("../util/index");

/**
 * 大类列表
 * @param { page } 页数
 * @param { size } 条数
 */
const categoryList = async function (ctx) {
  const { page = 1, size = 10 } = ctx.query;
  const uid = ctx.session.user_id;
  const { count, rows } = await categoryModel.findAndCountAll(
    parseInt(page),
    parseInt(size),
    uid
  );
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].brand_ids) {
      const sizeInfo = await brandModel.findByIds(rows[i].brand_ids, uid);
      rows[i].dataValues.brandNames = util.filterUnderLine(sizeInfo);
    }
  }
  ctx.body = {
    code: 200,
    data: rows,
    total: count,
    message: "请求成功",
  };
};

/**
 * 新增大类
 * @param { categoryName } 大类名称
 */
const categoryAdd = async function (ctx) {
  const { categoryName, brandIds } = ctx.request.body;
  const uid = ctx.session.user_id;
  if (!categoryName) {
    ctx.body = {
      code: 101,
      message: "大类名称不能为空",
    };
    return;
  }
  const hasInfo = await categoryModel.findByName(categoryName, uid);
  if (hasInfo) {
    ctx.body = {
      code: 101,
      message: "该大类已存在",
    };
    return;
  }
  const info = await categoryModel.create(categoryName, brandIds, uid);
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
 * 修改大类
 * @param { categoryName } 大类名称
 * @param { id } 大类id
 */
const categoryUpdate = async function (ctx) {
  const { categoryName, id, brandIds } = ctx.request.body;
  if (!id) {
    ctx.body = {
      code: 101,
      message: "大类id不能为空",
    };
    return;
  }
  if (!categoryName) {
    ctx.body = {
      code: 101,
      message: "大类名称不能为空",
    };
    return;
  }

  const info = await categoryModel.upload(id, categoryName, brandIds);
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
 * 删除大类
 * @param { id } 大类id
 */
const categoryDelete = async function (ctx) {
  const { id } = ctx.request.body;
  if (!id) {
    ctx.body = {
      code: 101,
      message: "大类id不能为空",
    };
    return;
  }

  const num = await categoryModel.destroy(id);
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
  categoryList,
  categoryAdd,
  categoryUpdate,
  categoryDelete,
};
