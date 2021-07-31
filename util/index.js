/**
  * @description  批量替换key
  * @param arr  要替换的数组
  * @return keyMap 要替换的键值对映射 {'id':'value','name':'label'}
  */
function convertKey(arr, keyMap) {
	let tempString = JSON.stringify(arr);
	console.log(tempString)
	for (var key in keyMap) {
		var reg = `/"${key}":/g`;
		tempString = tempString.replace(eval(reg), '"' + keyMap[key] + '":');
	}
	return JSON.parse(tempString);
}

/**
  * @description 下划线转驼峰命名
  * @param val  值
  * @return 
  */
 
const replaceUnderLine = (val, char = '_') => {
  const arr = val.split('')
  const index = arr.indexOf(char)
  arr.splice(index, 2, arr[index+1].toUpperCase())
  val = arr.join('')
  return val
}

/**
  * @description 数组批量转驼峰
  * @param val  array 数组
  * @return 
  */
const filterUnderLine = (array, char = '_') => {
    const obje = array.map(obj => {
		const arr =  Object.keys(obj.dataValues).filter(item => item.indexOf(char) !== -1)
		arr.forEach(item => {
		  const before = obj[item]
		  const key = replaceUnderLine(item)
		  obj.dataValues[key] = before
		  delete obj.dataValues[item]
		})
		return obj
	})
	return obje
}

/**
  * @description  对象转驼峰
  * @param 
  * @return 
  */
 const filterUnderLineObj = (obj, char = '_') => {
	 const arr =  Object.keys(obj.dataValues).filter(item => item.indexOf(char) !== -1)
	 arr.forEach(item => {
	   const before = obj[item]
	   const key = replaceUnderLine(item)
	   obj.dataValues[key] = before
	   delete obj.dataValues[item]
	 })
	 return obj
 }
/**
  * @description 查找两个数组中的多值
  * @param arr1 要查找的数组
  * @param arr2 要对比的数组
  * @return 
  */
const findManyArr = (arr1, arr2) => {
	if(!arr1 instanceof Array || !arr2 instanceof Array){
		return []
	}
	const arr = []
	for(var i =0; i< arr1.length; i++){
	    if(!arr2.includes(arr1[i])){
	      arr.push(arr1[i])
	    }
	}
	return arr
}

/**
  * @description  生成指定位数的随机数
  * @param  n 位数
  * @return 
  */
 
 const randomNum = (n = 2) => {
	let num = '';
	for (var i = 0; i < n; i++) {
		num += Math.floor(Math.random() * 10);
	}
	return num
 }
 
 /**
   * @description 生成订单号
   * @param  prefix 订单号前缀
   * @return 
   */
const generateOrder = prefix => {
	return prefix + new Date().getTime() + randomNum()
}
module.exports = {
	convertKey,
	replaceUnderLine,
	filterUnderLine,
	filterUnderLineObj,
	findManyArr,
	randomNum,
	generateOrder
};