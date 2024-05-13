const sequelize = require('../config/db.js'); // 引入todolist的表结构
const billModel = require('../models/bill');
const billGoodsModel = require('../models/billGoods');
const util = require('../util/index');
const date = require('../util/date.js');
const exportExcel = require('../util/exportExcel.js');
/**
 * 记账列表
 * @param { page } 页数
 * @param { limit } 条数
 * @param { status } 1记账 2撤销
 */
const billList = async function(ctx) {
	const {
		page = 1,
		size = 10,
		status = 1,
		type = 'thisDay'
	} = ctx.query;
	const uid = ctx.session.user_id;
	let createTimeBegin, createTimeEnd;
	if (type == 'thisDay') {
		createTimeBegin = date.getDay() + ' 00:00:00';
		createTimeEnd = date.getDay() + ' 23:59:59';
	} else if (type == 'lastDay') {
		createTimeBegin = date.getLastDay() + ' 00:00:00';
		createTimeEnd = date.getLastDay() + ' 23:59:59';
	} else if (type == 'thisWeek') {
		createTimeBegin = date.getWeekStartDate() + ' 00:00:00';
		createTimeEnd = date.getWeekEndDate() + ' 23:59:59';
	} else if (type == 'thisMonth') {
		createTimeBegin = date.getMonthStartDate() + ' 00:00:00';
		createTimeEnd = date.getMonthEndDate() + ' 23:59:59';
	} else if (type == 'all') {
		createTimeBegin = '';
		createTimeEnd = '';
	}
	const data = await billModel.findAll(parseInt(page), parseInt(size), status, createTimeBegin,
		createTimeEnd, uid)
	const count = await billModel.findCount(status, createTimeBegin, createTimeEnd, uid);

	ctx.body = {
		code: 200,
		data,
		total: count,
		message: '请求成功'
	}
}


/**
 * @description  根据订单号查看详情
 * @param billSn 单号
 * @return 
 */
const billDetail = async function(ctx) {
	const {
		billSn
	} = ctx.query;
	const uid = ctx.session.user_id;
	let data = await billModel.findOne(billSn);
	const list = await billGoodsModel.findAll(billSn);
	data.dataValues.goods = util.filterUnderLine(list)
	let = util.filterUnderLineObj(data);
	ctx.body = {
		code: 200,
		data: data,
		message: '请求成功'
	}
}

/**
 * @description 新增销售
 * @param goods	商品列表
 * @return 
 */

const  billAdd = async function(ctx) {
	const {
		goods,
		remark
	} = ctx.request.body;
	const uid = ctx.session.user_id;
	if (!goods.length) {
		ctx.body = {
			code: 101,
			message: '请选中商品'
		}
		return;
	}

	//开始一个事务并将其保存到变量 t 中
	const t = await sequelize.transaction();
	try {
		let billSn = util.generateOrder('BL');
		
		const info = await billModel.create({
			billSn,
			remark,
			uid
		}, {
			transaction: t
		})

		for (let i = 0; i < goods.length; i++) {
			const item = goods[i];
			const totalPrice = Number(item.total) * Number(item.price)
			// 保存商品数据
			await  billGoodsModel.create({
				billSn,
				goodsId: item.goodsId,
				goodsName: item.goodsName,
				goodsImg: item.goodsImg,
				total: item.total,
				price: item.price,
				totalPrice: totalPrice,
				uid
			}, {
				transaction: t
			});
		}
		//都保存成功则提交
		await t.commit();
		ctx.body = {
			code: 200,
			data: util.filterUnderLineObj(info),
			message: '新增销售成功'
		}
	} catch (e) {
		await t.rollback();
		console.log(e)
		ctx.body = {
			code: 101,
			message: '系统异常'
		}
	}
}
/**
 * @description 撤销
 * @param billSn 单号
 * @return 
 */
const billBackout = async function(ctx) {
	const {
		billSn
	} = ctx.request.body;
	try{
		await billModel.changeStatus(billSn, 2)
		ctx.body = {
			code: 200,
			message: '撤销成功'
		}
	}catch(e){
		console.log(e)
		ctx.body = {
			code: 101,
			message: '系统异常'
		}
	}
}


/**
 * @description 导出excel
 * @param billSn 单号
 * @return 
 */
const billExport = async function(ctx) {
	const {
		billSn
	} = ctx.request.body;
	try{
		
		const list = await billGoodsModel.findAll(billSn);
		
		await exportExcel(
		  [
			{ header: "商品名称", key: "goods_name" },
			{ header: "个数", key: "total" },
			{ header: "单价(元)", key: "price" },
			{ header: "总价(元)", key: "total_price" },
		  ],
		  list,
		  ctx
		);
	}catch(e){
		console.log(e)
		ctx.body = {
			code: 101,
			message: '系统异常'
		}
	}
}

module.exports = {
	billAdd,
	billList,
	billDetail,
	billBackout,
	billExport
}