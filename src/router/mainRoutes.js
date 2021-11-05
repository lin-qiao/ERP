/*
 * @Author: your name
 * @Date: 2021-01-13 17:39:02
 * @LastEditTime: 2021-01-18 15:48:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue3-element-admin\src\router\mainRoutes.js
 */
export default {
    path: "/",
    name: "AppMain",
    component: () => import("@/views/AppMain.vue"),
    redirect: { name: "Stock" },
    children: [
		{
		    path: "brand",
		    name: "Brand",
		    component: () => import("@/views/brand/index.vue")
		},
		{
		    path: "size",
		    name: "Size",
		    component: () => import("@/views/size/index.vue")
		},
		{
		    path: "stock",
		    name: "Stock",
		    component: () => import("@/views/stock/index.vue")
		},
		{
		    path: "businessFlow",
		    name: "BusinessFlow",
		    component: () => import("@/views/businessFlow/index.vue")
		},
		{
		    path: "saleStat",
		    name: "SaleStat",
		    component: () => import("@/views/businessFlow/sale.vue")
		},
		{
		    path: "purchaseStat",
		    name: "PurchaseStat",
		    component: () => import("@/views/businessFlow/purchase.vue")
		},
		{
		    path: "goods",
		    name: "Goods",
		    component: () => import("@/views/goods/index.vue")
		},
		{
		    path: "supplier",
		    name: "Supplier",
		    component: () => import("@/views/supplier/index.vue")
		},
		{
		    path: "purchase",
		    name: "Purchase",
		    component: () => import("@/views/purchase/index.vue")
		},
		{
		    path: "purchaseReturn",
		    name: "PurchaseReturn",
		    component: () => import("@/views/purchaseReturn/index.vue")
		},
		{
		    path: "sale",
		    name: "Sale",
		    component: () => import("@/views/sale/index.vue")
		},
		{
		    path: "saleReturn",
		    name: "SaleReturn",
		    component: () => import("@/views/saleReturn/index.vue")
		},
		{
		    path: "calculator",
		    name: "Calculator",
		    component: () => import("@/views/calculator/index.vue")
		},
    ]
};
