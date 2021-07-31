const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('purchase_goods', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    purchase_sn: {
      type: DataTypes.CHAR(17),
      allowNull: false,
      comment: "订单号"
    },
    goods_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "商品id"
    },
    size_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "尺码id"
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "数量"
    },
    price: {
      type: DataTypes.DOUBLE(20,2),
      allowNull: false,
      comment: "价格"
    },
    amount: {
      type: DataTypes.DOUBLE(20,2),
      allowNull: false,
      comment: "总价"
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "创建时间"
    },
	user_id: {
	  type: DataTypes.INTEGER,
	  allowNull: false,
	  comment: "用户id"
	}
  }, {
    sequelize,
    tableName: 'purchase_goods',
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
