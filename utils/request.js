import { BASE_URL } from './config'
function request(method, url, data, showToast = true) {
	var promise = new Promise(async (resolve, reject) => {
		let token = wx.getStorageSync('token');
		let header = {};
		if(token){
			header.authorization = 'Bearer ' + token
		}
		const newUrl = BASE_URL + url;
		
		uni.request({
			url: newUrl,
			data: data,
			method: method,
			header: header,
			success: (res) => {
				var obj = checkStatus(res, method, url, data, showToast);
				resolve(obj)
			},
			error: function(e) {
				wx.showToast({
					title: '网络错误,请稍后重试',
					icon: 'none',
					duration: 1500
				})
			}
		})
	}).then(res => {
		return new Promise((resolve, reject) => {
			res.code == 200? resolve(res): reject(res)
		})
	});
	return promise;
}

function checkStatus(res, method, url, data, showToast) {
	const { code, message } = res.data;
	if (code != 200) {
		if (showToast) {
			wx.showToast({
				title: message,
				icon: 'none',
				duration: 1500
			})
		}
		if(code == -1){
			uni.removeStorageSync('token')
			uni.redirectTo({
				url: '/pages/login/login'
			})
		}
	}
	return (res.data);
}
export default request
