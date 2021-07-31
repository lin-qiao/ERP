const supplierModel = require('../models/supplier');
const util = require('../util/index');
/**
 * 供应商列表
 * @param { page } 页数
 * @param { size } 条数
 */
const supplierList = async function(ctx) {
	const {
		page = 1, size = 10
	} = ctx.query;
	const uid = ctx.session.user_id;
	const { count, rows } = await supplierModel.findAndCountAll(parseInt(page), parseInt(size), uid)
	const list = util.filterUnderLine(rows)
	ctx.body = {
		code: 200,
		data: list,
		total: count,
		message: '请求成功'
	}
}

/**
 * 新增供应商
 * @param { supplierName } 供应商名称
 */
const supplierAdd = async function(ctx) {
	const {
		supplierName,
		contact,
	} = ctx.request.body;
	const uid = ctx.session.user_id;
	if (!supplierName) {
		ctx.body = {
			code: 101,
			message: '供应商名称不能为空'
		}
		return;
	}
	if (!contact) {
		ctx.body = {
			code: 101,
			message: '联系方式不能为空'
		}
		return;
	}
	const hasInfo = await supplierModel.findByName(supplierName, uid);
	if (hasInfo) {
		ctx.body = {
			code: 101,
			message: '该供应商已存在'
		}
		return;
	}
	const info = await supplierModel.create(supplierName, contact, uid)
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
 * 修改供应商
 * @param { supplierName } 供应商名称
 * @param { id } 供应商id
 */
const supplierUpdate = async function(ctx) {
	const {
		supplierName,
		id,
		contact
	} = ctx.request.body;
	if (!id) {
		ctx.body = {
			code: 101,
			message: '供应商id不能为空'
		}
		return;
	}
	if (!supplierName) {
		ctx.body = {
			code: 101,
			message: '供应商名称不能为空'
		}
		return;
	}
	if (!contact) {
		ctx.body = {
			code: 101,
			message: '联系方式不能为空'
		}
		return;
	}
	const info = await supplierModel.upload(id, supplierName, contact)
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
 * 删除供应商
 * @param { id } 供应商id
 */
const supplierDelete = async function(ctx) {
	const {
		id
	} = ctx.request.body;
	if (!id) {
		ctx.body = {
			code: 101,
			message: '供应商id不能为空'
		}
		return;
	}
	
	const num = await supplierModel.destroy(id)
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
	supplierList,
	supplierAdd,
	supplierUpdate,
	supplierDelete
}
