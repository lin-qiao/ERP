/**
 * 大数字转换，将大额数字转换为万、千万、亿等
 * @param value 数字值
 */
export function bigNumberTransform(value) {
	const newValue = ['', '', '']
	let fr = 1000
	let num = 3
	let text1 = ''
	let fm = 1
	while (value / fr >= 1) {
		fr *= 10
		num += 1
		// console.log('数字', value / fr, 'num:', num)
	}
	if (num <= 4) { // 千
		newValue[0] = parseInt(value / 1000) + ''
		newValue[1] = '千'
	} else if (num <= 8) { // 万
		text1 = parseInt(num - 4) / 3 > 1 ? '千万' : '万'
		// tslint:disable-next-line:no-shadowed-variable
		fm = text1 === '万' ? 10000 : 10000000
		if (value % fm === 0) {
			newValue[0] = parseInt(value / fm) + ''
		} else {
			newValue[0] = parseFloat(value / fm).toFixed(2) + ''
		}
		newValue[1] = text1
	} else if (num <= 16) { // 亿
		text1 = (num - 8) / 3 > 1 ? '千亿' : '亿'
		text1 = (num - 8) / 4 > 1 ? '万亿' : text1
		text1 = (num - 8) / 7 > 1 ? '千万亿' : text1
		// tslint:disable-next-line:no-shadowed-variable
		fm = 1
		if (text1 === '亿') {
			fm = 100000000
		} else if (text1 === '千亿') {
			fm = 100000000000
		} else if (text1 === '万亿') {
			fm = 1000000000000
		} else if (text1 === '千万亿') {
			fm = 1000000000000000
		}
		if (value % fm === 0) {
			newValue[0] = parseInt(value / fm) + ''
		} else {
			newValue[0] = parseFloat(value / fm).toFixed(2) + ''
		}
		newValue[1] = text1
	}
	if (value < 1000) {
		newValue[0] = value + ''
		newValue[1] = ''
	}
	return newValue.join('')
}


/**
 * @description 格式化金额
 * @param 
 * @return 
 */
export function formatMoney(s){
	if (s === 0) {
		return '0.00'
	} else if (s === '' || s == null) {
		return ''
	}
	var n = 2
	var b = parseFloat(s)
	n = n > 0 && n <= 20 ? n : 2
	if (b < 0) {
		s = (-1 * parseFloat((s + '').replace(/[^\d\.-]/g, ''))).toFixed(n) + '';
	} else {
		s = parseFloat((s + '').replace(/[^\d\.-]/g, '')).toFixed(n) + '';
	}
	var l = s.split('.')[0].split('').reverse()
	var r = s.split('.')[1]
	var t = ''
	for (var i = 0; i < l.length; i++) {
		t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? ',' : '')
	}
	if (b < 0) {
		return '-' + t.split('').reverse().join('') + '.' + r
	} else {
		return t.split('').reverse().join('') + '.' + r
	}
}

/**
  * @description  时间格式化
  * @param 
  * @return 
  */
 
export function dataFormat (data, fmt) { //author: meizz 
    if(!data){
		return '';
	}
	data = new Date(data)
    var o = {
        "M+": data.getMonth() + 1, //月份 
        "d+": data.getDate(), //日 
        "h+": data.getHours(), //小时 
        "m+": data.getMinutes(), //分 
        "s+": data.getSeconds(), //秒 
        "q+": Math.floor((data.getMonth() + 3) / 3), //季度 
        "S": data.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (data.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}