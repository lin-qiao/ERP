const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('bill_goods', {
    id: {
	  autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    bill_sn: {
      type: DataTypes.CHAR(17),
      allowNull: true
    },
    goods_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
	goods_img: {
	  type: DataTypes.STRING(255),
	  allowNull: true
	},
    goods_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    price: {
      type: DataTypes.DOUBLE(20,2),
      allowNull: true
    },
    total_price: {
      type: DataTypes.DOUBLE(20,2),
      allowNull: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'bill_goods',
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
