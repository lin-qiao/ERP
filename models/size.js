const {
	Op,
	DataTypes,
} = require("sequelize");
const sequelize = require('../config/db.js'); // 引入todolist的表结构
const schema = '../schema/size.js';

const model = require(schema)(sequelize, DataTypes)


const findAndCountAll = async function(page, size, uid) {
	return model.findAndCountAll({
		where: {
			'user_id': uid
		},
		limit: size,
		offset: size * (page - 1)
	})
}


const findByName = async function(name, uid) {
	return model.findOne({
		where: {
			user_id: uid,
			size_name: name
		}
	})
}

const findByIds = async function(ids, uid) {
	const idList = ids.split(',')
	return model.findAll({
		where: {
			user_id: uid,
			id: {
				[Op.or]: idList, 
			}
		}
	})
}


const create = async function(sizeName, uid) {
	return model.create({
		size_name: sizeName,
		user_id: uid,
		create_time: new Date()
	})
}

const upload = async function(id, sizeName) {
	return model.update({
		size_name: sizeName
	}, {
		where: {
			id
		}
	})
}

const destroy = async function(id) {
	return model.destroy({
		where: {
			id
		}
	})
}
module.exports = {
	findAndCountAll,
	findByName,
	findByIds,
	create,
	upload,
	destroy
}
