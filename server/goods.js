const goodsModel = require('../models/goods');
const sizeModel = require('../models/size');
const brandModel = require('../models/brand');
const stockModel = require('../models/stock');

const axios = require('axios');
const getQueryStr = require('../util/getQuery');
const config = require('../config/index');
const util = require('../util/index');
/**
 * 商品列表
 * @param { page } 页数
 * @param { limit } 条数
 */
const goodsList = async function(ctx) {
	const {
		page = 1, size = 10, name = ''
	} = ctx.query;
	const uid = ctx.session.user_id;
	const {
		count,
		rows
	} = await goodsModel.findAndCountAll(parseInt(page), parseInt(size), name, uid)


	for (let i = 0; i < rows.length; i++) {
		rows[i].dataValues.brandName = rows[i].brand.dataValues.brandName;
		if (rows[i].size_ids) {
			const sizeInfo = await sizeModel.findByIds(rows[i].size_ids, uid);
			rows[i].dataValues.sizeNames = util.filterUnderLine(sizeInfo);
		}
	}

	const list = util.filterUnderLine(rows)
	ctx.body = {
		code: 200,
		data: list,
		total: count,
		message: '请求成功'
	}
}

/**
 * 根据货号获取商品信息
 * @param { code } 商品货号
 */
const getGoodsBySn = async function(ctx) {
	const {
		code,
	} = ctx.query;

	const queryStr = getQueryStr({
		title: code,
		page: 0,
		limit: 20,
		showHot: -1,
		sortType: 1,
		sortMode: 1,
		unionId: "",
	});
	const {
		data
	} = await axios.get('https://app.poizon.com/api/v1/h5/search/fire/search/list?' + queryStr, {
		headers: {
			'Host': 'app.poizon.com',
			'accept': '*/*',
			'content-type': 'application/x-www-form-urlencoded',
			'referer': 'https://servicewechat.com/wx3c12cdd0ae8b1a7b/117/page-frame.html',
			'appid': 'wxapp',
			'appversion': '4.4.0',
			'wxapp-login-token': '3f885cf3|5805b23362561089694d1976c3f2ea84|1843f86c|13d7302d',
			'accept-language': 'zh-cn',
			'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/7.0.12(0x17000c2f) NetType/WIFI Language/zh_CN'
		}
	});
	ctx.body = {
		code: 200,
		message: '成功',
		data: data.data.productList
	}
}

/**
 * 新增商品
 * @param { name } 商品名称
 * @param { goodSn } 商品货号
 * @param { imgUrl } 商品图片
 * @param { brandId } 商品品牌id
 * @param { sizeIds } 商品尺码ids
 * @param { purchasePrice } 商品采购价
 */
const goodsAdd = async function(ctx) {
	const {
		name,
		goodSn,
		imgUrl,
		brandId,
		sizeIds,
		purchasePrice
	} = ctx.request.body;
	const uid = ctx.session.user_id;
	if (!name) {
		ctx.body = {
			code: 101,
			message: '商品名称不能为空'
		}
		return;
	}
	if (!goodSn) {
		ctx.body = {
			code: 101,
			message: '商品货号不能为空'
		}
		return;
	}
	if (!sizeIds) {
		ctx.body = {
			code: 101,
			message: '商品尺码不能为空'
		}
		return;
	}

	const hasInfo = await goodsModel.findByGoodsSn(goodSn, uid);
	if (hasInfo) {
		ctx.body = {
			code: 101,
			message: '该商品已存在'
		}
		return;
	}
	const info = await goodsModel.create(name, goodSn, imgUrl, brandId, sizeIds, purchasePrice, uid)
	
	if(!info.id){
		ctx.body = {
			code: 101,
			message: '新增失败'
		}
		return;
	}
	
	
	// 添加库存
	let sizeIdList = sizeIds.split(',');
	sizeIdList = sizeIdList.map(item => ({
		'goods_id': info.id,
		'size_id': item,
		'number': 0,
		'cost_price': 0,
		'total_price': 0,
		'update_time': new Date(),
		'user_id': uid
	}))
	
	const stockInfo = await stockModel.bulkCreate(sizeIdList);
	
	if(!stockInfo.length){
		ctx.body = {
			code: 101,
			message: '新增失败'
		}
	}
	ctx.body = {
		code: 200,
		message: '新增成功'
	}
}


/**
 * 修改商品
 * @param { id } id
 * @param { name } 商品名称
 * @param { goodSn } 商品货号
 * @param { imgUrl } 商品图片
 * @param { brandId } 商品品牌id
 * @param { sizeIds } 商品尺码ids
 * @param { purchasePrice } 商品采购价
 */
const goodsUpdate = async function(ctx) {
	const {
		id,
		name,
		goodSn,
		imgUrl,
		brandId,
		sizeIds,
		purchasePrice
	} = ctx.request.body;
	const uid = ctx.session.user_id;
	if (!id) {
		ctx.body = {
			code: 101,
			message: '商品id不能为空'
		}
		return;
	}
	if (!name) {
		ctx.body = {
			code: 101,
			message: '商品名称不能为空'
		}
		return;
	}
	if (!goodSn) {
		ctx.body = {
			code: 101,
			message: '商品货号不能为空'
		}
		return;
	}
	if (!sizeIds) {
		ctx.body = {
			code: 101,
			message: '商品尺码不能为空'
		}
		return;
	}
	try{
		const { size_ids: oldSizeIds } = await goodsModel.findByGoodsId(id);
		
		const info = await goodsModel.update(id, name, goodSn, imgUrl, brandId, sizeIds, purchasePrice)
		
		
		//修改库存表
		let sizeIdList = sizeIds.split(','), oldSizeIdList = oldSizeIds.split(',');
		//id一样，不做修改
		if(sizeIdList.sort().toString() == oldSizeIdList.sort().toString()){
			ctx.body = {
				code: 200,
				message: '修改成功'
			}
			return;
		}
		// 要加的要减 的
		const addList = util.findManyArr(sizeIdList, oldSizeIdList);
		const reduceList = util.findManyArr(oldSizeIdList, sizeIdList);
		if(addList.length){
			addList.forEach(async item => {
				await stockModel.create(id, item, 0, 0, 0, uid);
			})
		}
		
		if(reduceList.length){
			reduceList.forEach(async item => {
				await stockModel.destroy(id, item, uid);
			})
		}
		
		ctx.body = {
			code: 200,
			message: '修改成功'
		}
	}catch(e){
		ctx.body = {
			code: 101,
			message: e
		}
	}
}


/**
 * 删除商品
 * @param { id } id
 */
const goodsDelete = async function(ctx) {
	const {
		id
	} = ctx.request.body;
	const uid = ctx.session.user_id;
	if (!id) {
		ctx.body = {
			code: 101,
			message: '商品id不能为空'
		}
		return;
	}

	try{
		// 查询是否还有库存
		const sum = await stockModel.sumStock(id, uid);
		if(sum){
			ctx.body = {
				code: 101,
				message: '当前库存不为0，无法删除'
			}
		}
		// 删除商品表
		await goodsModel.destroy(id)
		await stockModel.destroyByGoodsId(id, uid);
		ctx.body = {
			code: 200,
			message: '删除成功'
		}
	}catch(e){
		ctx.body = {
			code: 101,
			message: e
		}
	}
}
module.exports = {
	goodsList,
	goodsAdd,
	goodsUpdate,
	goodsDelete,
	getGoodsBySn
}
