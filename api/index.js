import request from '../utils/request.js';

export const login =  (data) => request('POST', '/api/login', data); 
export const getStockGoodsList =  (data) => request('GET', '/api/stockGoodsList', data); 
export const getStockStat =  (data) => request('GET', '/api/stockStat', data); 
export const getGoodsStock =  (data) => request('GET', '/api/getGoodsStock', data); 
export const saleAdd =  (data) => request('POST', '/api/saleAdd', data); 
export const saleList =  (data) => request('GET', '/api/saleList', data); 
export const saleDetail =  (data) => request('GET', '/api/saleDetail', data); 
export const saleBackout =  (data) => request('POST', '/api/saleBackout', data); 

export const purchaseAdd =  (data) => request('POST', '/api/purchaseAdd', data); 
export const purchaseList =  (data) => request('GET', '/api/purchaseList', data); 
export const purchaseDetail =  (data) => request('GET', '/api/purchaseDetail', data); 
export const purchaseBackout =  (data) => request('POST', '/api/purchaseBackout', data); 
export const saleStatList =  (data) => request('GET', '/api/saleStatList', data); 
export const saleCount =  (data) => request('GET', '/api/saleCount', data); 
export const purchaseStatList =  (data) => request('GET', '/api/purchaseStatList', data); 
export const purchaseCount =  (data) => request('GET', '/api/purchaseCount', data);
export const userInfo =  (data) => request('GET', '/api/userInfo', data);
