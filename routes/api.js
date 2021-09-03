const koaRouter = require('koa-router') 
const router = koaRouter()
const user = require('../server/user.js')
const brand = require('../server/brand.js')
const size = require('../server/size.js')
const goods = require('../server/goods.js')
const stock = require('../server/stock.js')
const supplier = require('../server/supplier.js')
const purchase = require('../server/purchase.js')
const sale = require('../server/sale.js')
const businessFlow = require('../server/businessFlow.js')


//登录
router.post('/login', user.userLogin)
// 注册
router.post('/register', user.register)
//用户信息
router.get('/userInfo', user.userInfo)
//品牌列表
router.get('/brandList', brand.brandList)
//添加品牌
router.post('/brandAdd', brand.brandAdd)
//修改品牌
router.post('/brandUpdate', brand.brandUpdate)
//删除品牌
router.post('/brandDelete', brand.brandDelete)
//品牌列表
router.get('/sizeList', size.sizeList)
//添加品牌
router.post('/sizeAdd', size.sizeAdd)
//修改品牌
router.post('/sizeUpdate', size.sizeUpdate)
//删除品牌
router.post('/sizeDelete', size.sizeDelete)
//商品列表
router.get('/goodsList', goods.goodsList)
//添加商品 
router.post('/goodsAdd', goods.goodsAdd)
//修改商品
router.post('/goodsUpdate', goods.goodsUpdate)
//删除商品
router.post('/goodsDelete', goods.goodsDelete)
//根据货号获取商品信息
router.get('/getGoodsBySn', goods.getGoodsBySn)
//查询库存单品列表
router.get('/stockList', stock.stockList)
//查询库存商品列表
router.get('/stockGoodsList', stock.stockGoodsList)
//查询当前商品库存
router.get('/getGoodsStock', stock.getGoodsStock)
//库存统计
router.get('/stockStat', stock.stockStat)
//品牌列表
router.get('/supplierList', supplier.supplierList)
//添加品牌
router.post('/supplierAdd', supplier.supplierAdd)
//修改品牌
router.post('/supplierUpdate', supplier.supplierUpdate)
//删除品牌
router.post('/supplierDelete', supplier.supplierDelete)
//采购列表
router.get('/purchaseList', purchase.purchaseList)
//添加采购
router.post('/purchaseAdd', purchase.purchaseAdd)
//采购详情
router.get('/purchaseDetail', purchase.purchaseDetail)
//撤销采购
router.post('/purchaseBackout', purchase.purchaseBackout)
//库存流水列表
router.get('/businessFlowList', businessFlow.businessFlowList)
//销售报表
router.get('/saleStatList', businessFlow.saleStatList)
//销售统计
router.get('/saleCount', businessFlow.saleCount)
//采购报表
router.get('/purchaseStatList', businessFlow.purchaseStatList)
//采购统计
router.get('/purchaseCount', businessFlow.purchaseCount)
//商品销售报表
router.get('/goodsSaleStatList', businessFlow.goodsSaleStatList)
//销售列表
router.get('/saleList', sale.saleList)
//添加销售
router.post('/saleAdd', sale.saleAdd)
//销售详情
router.get('/saleDetail', sale.saleDetail)
//撤销销售
router.post('/saleBackout', sale.saleBackout)


module.exports = router