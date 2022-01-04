const userModel = require('../models/user');
const jsonwebtoken = require('jsonwebtoken');
const crypto = require('crypto');
/**
 * 用户登录
 * @param { mobile } 手机号
 * @param { password } 密码
 */
const userLogin = async function(ctx) {
	const data = ctx.request.body; //取拿到的数据
	const result = {};

	let mobile_reg = /^13[0-9]{1}[0-9]{8}$|15[0-9]{1}[0-9]{8}$|18[0-9]{1}[0-9]{8}$|17[0-9]{9}$/;
	if (!data.mobile) {
		ctx.body = {
			code: 101,
			message: '用户名不能为空'
		}
		return;
	}
	if (!mobile_reg.test(data.mobile)) {
		ctx.body = {
			code: 101,
			message: '手机号格式不正确'
		}
		return;
	}
	if (!data.password) {
		ctx.body = {
			code: 101,
			message: '密码不能为空'
		}
		return;
	}

	const userInfo = await userModel.findUser(data.mobile)
	const hash = crypto.createHash('md5');
	hash.update(data.password);
	const password = hash.digest('hex')
	console.log(password)
	if (!userInfo) {
		ctx.body = {
			code: 101,
			message: '当前用户不存在'
		}
		return;
	}

	if (userInfo.password != password) {
		ctx.body = {
			code: 101,
			message: '密码错误'
		}
		return;
	}
	
	const user = {
		id: userInfo.id,
		mobile: userInfo.mobile,
		nickName: userInfo.nick_name
	}
	ctx.body = {
		code: 200,
		message: '登录成功',
		data: user,
		token: jsonwebtoken.sign(user, 'ht', {
			expiresIn: '365d'
		}),
	}
}


/**
 * 用户信息
 */
const userInfo = async function(ctx) {
	const uid = ctx.session.user_id;
	const userInfo = await userModel.findUserById(uid);
	const data = {
		id: userInfo.id,
		mobile: userInfo.mobile,
		nickName: userInfo.nick_name
	} 
	ctx.body = {
		code: 200,
		data,
		message: '成功',
	}

}


/**
 * 用户注册
 * @param { mobile } 手机号
 * @param { password } 密码
 */
const register = async function(ctx) {
	const data = ctx.request.body; //取拿到的数据
	const result = {};

	let mobile_reg = /^13[0-9]{1}[0-9]{8}$|15[0-9]{1}[0-9]{8}$|18[0-9]{1}[0-9]{8}$|17[0-9]{9}$/;
	if (!data.mobile) {
		ctx.body = {
			code: 101,
			message: '手机号不能为空'
		}
		return;
	}
	if (!mobile_reg.test(data.mobile)) {
		ctx.body = {
			code: 101,
			message: '手机号格式不正确'
		}
		return;
	}
	if (!data.password) {
		ctx.body = {
			code: 101,
			message: '密码不能为空'
		}
		return;
	}

	try{
		const userInfo = await userModel.findUser(data.mobile)
		if (userInfo) {
			ctx.body = {
				code: 101,
				message: '当前手机号已经注册'
			}
			return;
		}
		const hash = crypto.createHash('md5');
		hash.update(data.password);
		const password = hash.digest('hex');
		
		const info = await userModel.create(data.mobile, password);
		const user = {
			id: info.id,
			mobile: info.mobile,
			nickName: info.nick_name
		}
		ctx.body = {
			code: 200,
			message: '登录成功',
			data: user,
			token: jsonwebtoken.sign(user, 'ht', {
				expiresIn: '1d'
			}),
		}
	}catch(e){
		console.log(e)
		ctx.body = {
			code: 101,
			message: '系统异常'
		}
	}
}
module.exports = {
	userLogin,
	userInfo,
	register
}
