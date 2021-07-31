const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('stock', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    goods_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    size_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
	cost_price: {
	  type: DataTypes.DOUBLE(20,2),
	  allowNull: false,
	  comment: "成本价"
	},
	total_price: {
	  type: DataTypes.DOUBLE(20,2),
	  allowNull: false,
	  comment: "总价"
	},
    update_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
	user_id: {
	  type: DataTypes.INTEGER,
	  allowNull: false,
	  comment: "用户id"
	}
  }, {
    sequelize,
    tableName: 'stock',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
