const {
	app_key,
	app_secret
} = require("../config/index.js");
const CryptoJS = require('crypto-js');  //引用AES源码js
const sign = require("../util/sign");
const axios = require('axios');



 //解密方法
const aesDecode = function(content, key) {
	 let getKey = function(key){
      return CryptoJS.SHA1(CryptoJS.SHA1(key)).toString().substring(0, 32)
    }
    let decrypt = function(data, key) {
    	let decrypt = CryptoJS.AES.decrypt(
	        {
	          ciphertext: CryptoJS.enc.Base64.parse(data)
	        },
	        CryptoJS.enc.Hex.parse(getKey(key)),
	        {
	          mode: CryptoJS.mode.ECB,
	          padding: CryptoJS.pad.Pkcs7
	        }
	      )
	      return decrypt.toString(CryptoJS.enc.Utf8)
		}
     
    
    return decrypt(content, key)

    // let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
    // let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    // let decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    // let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    // return decryptedStr.toString();
}


/**
 * 获取得物推送的消息
 * @param { code } 商品货号
 */
const getMessage = async function(ctx) {
	const {
		msg,
		type,
		name
	} = ctx.request.body;
	const content = aesDecode(msg, app_secret);

	if(!content){
		ctx.body = {
		code: -1,
		message: '失败',
		}
	}
	const obj = JSON.parse(content);
	const params = {
		app_key: app_key,
		timestamp: new Date().getTime(),
		order_no: obj.orderNo,
		page_no: 1,
		page_size: 10
	};
	
	params.sign = sign(params);
	const { data } = await axios.get('https://openapi.dewu.com/dop/api/v2/bill/realtime_list', {
		params
	});
	console.log(data)

	// ctx.body = {
	// 	code: 200,
	// 	message: '成功',
	// 	data: list
	// }
}
module.exports = {
	getMessage
}