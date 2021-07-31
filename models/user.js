const {
	Op,
	DataTypes,
} = require("sequelize");
const sequelize = require('../config/db.js'); // 引入todolist的表结构
const schema = '../schema/user.js';

const model = require(schema)(sequelize, DataTypes)


const findUser = async function (mobile){
	return model.findOne({
		where:{
			mobile
		}
	})
}

const findUserById = async function (id){
	return model.findOne({
		where:{
			id
		}
	})
}
const create = async function (mobile, password){
	return model.create({
		'mobile': mobile,
		'password': password,
		'nick_name': mobile
	})
}

module.exports = {
	findUser,
	findUserById,
	create
}