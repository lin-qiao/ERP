const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('business_flow', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
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
    flow_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "1、采购 2、采购退货 3、销售  4、销售退货"
    },
    business_sn: {
      type: DataTypes.CHAR(17),
      allowNull: false,
      comment: "业务单号"
    },
    business_price: {
      type: DataTypes.DOUBLE(20,2),
      allowNull: false,
      comment: "业务单价"
    },
    cost_price: {
      type: DataTypes.DOUBLE(20,2),
      allowNull: false,
      comment: "库存成本单价"
    },
    total_price: {
      type: DataTypes.DOUBLE(20,2),
      allowNull: false,
      comment: "剩余库存成本"
    },
    number_stored: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "库存"
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "库存增加数量"
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "用户id"
    },
    total_business_price: {
      type: DataTypes.DOUBLE(20,2),
      allowNull: false,
      comment: "业务成本"
    },
    gross_profit_price: {
      type: DataTypes.DOUBLE(20,2),
      allowNull: false,
      comment: "毛利"
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0 删除 1 正常"
    }
  }, {
    sequelize,
    tableName: 'business_flow',
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
