const sizeModel = require('../models/size');

/**
 * 品牌列表
 * @param { page } 页数
 * @param { size } 条数
 */
const sizeList = async function(ctx) {
	const {
		page = 1, size = 10
	} = ctx.query;
	const uid = ctx.session.user_id;
	const {rows, count} = await sizeModel.findAndCountAll(parseInt(page), parseInt(size), uid)
	ctx.body = {
		code: 200,
		data: rows,
		total: count,
		message: '请求成功'
	}
}

/**
 * 新增品牌
 * @param { sizeName } 品牌名称
 */
const sizeAdd = async function(ctx) {
	const {
		sizeName
	} = ctx.request.body;
	const uid = ctx.session.user_id;
	if (!sizeName) {
		ctx.body = {
			code: 101,
			message: '品牌名称不能为空'
		}
		return;
	}
	const hasInfo = await sizeModel.findByName(sizeName, uid);
	if (hasInfo) {
		ctx.body = {
			code: 101,
			message: '该品牌已存在'
		}
		return;
	}
	const info = await sizeModel.create(sizeName, uid)
	if (info.id) {
		ctx.body = {
			code: 200,
			message: '新增成功'
		}
	} else {
		ctx.body = {
			code: 101,
			message: '新增失败'
		}
	}

}


/**
 * 修改品牌
 * @param { sizeName } 品牌名称
 * @param { id } 品牌id
 */
const sizeUpdate = async function(ctx) {
	const {
		sizeName,
		id
	} = ctx.request.body;
	if (!id) {
		ctx.body = {
			code: 101,
			message: '品牌id不能为空'
		}
		return;
	}
	if (!sizeName) {
		ctx.body = {
			code: 101,
			message: '品牌名称不能为空'
		}
		return;
	}
	
	const info = await sizeModel.upload(id, sizeName)
	if (info[0]) {
		ctx.body = {
			code: 200,
			message: '修改成功'
		}
	} else {
		ctx.body = {
			code: 101,
			message: '修改失败'
		}
	}
}

/**
 * 删除品牌
 * @param { id } 品牌id
 */
const sizeDelete = async function(ctx) {
	const {
		id
	} = ctx.request.body;
	if (!id) {
		ctx.body = {
			code: 101,
			message: '品牌id不能为空'
		}
		return;
	}
	
	const num = await sizeModel.destroy(id)
	if (num == 1) {
		ctx.body = {
			code: 200,
			message: '删除成功'
		}
	} else {
		ctx.body = {
			code: 101,
			message: '删除失败'
		}
	}
}
module.exports = {
	sizeList,
	sizeAdd,
	sizeUpdate,
	sizeDelete
}
