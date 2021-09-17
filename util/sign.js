var md5 = require("md5");
const config = require('../config/index');
/**
   *  签名算法
   */
   const sign = (data) => {
    let paramsStr =
      Object.keys(data)
        .sort()
        .map(key =>  `${key}=${encodeURIComponent(data[key])}`)
        .join('&') + config.app_secret
    paramsStr = paramsStr.replace(/%20/gi, '+')
    return md5(paramsStr).toUpperCase() 
  }
  
module.exports = sign;
