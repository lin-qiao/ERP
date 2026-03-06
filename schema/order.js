const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "order",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      order_sn: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: "订单号",
      },
      order_type: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: "订单类型",
      },
      goods_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "商品id",
      },
      size_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "尺码id",
      },
      bid_price: {
        type: DataTypes.DOUBLE(20, 2),
        allowNull: false,
        comment: "出价金额",
      },
      transaction_price: {
        type: DataTypes.DOUBLE(20, 2),
        allowNull: true,
        comment: "交易金额",
      },
      income_price: {
        type: DataTypes.DOUBLE(20, 2),
        allowNull: false,
        comment: "预计收入",
      },
      received_price: {
        type: DataTypes.DOUBLE(20, 2),
        allowNull: true,
        comment: "实收金额",
      },
      cost_price: {
        type: DataTypes.DOUBLE(20, 2),
        allowNull: false,
      },
      profit_price: {
        type: DataTypes.DOUBLE(20, 2),
        allowNull: false,
        comment: "预计利润",
      },
      actual_profit_price: {
        type: DataTypes.DOUBLE(20, 2),
        allowNull: true,
        comment: "实际利润",
      },
      order_status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "订单状态 1未结算 2已结算 3已退货 4已关闭",
      },
      order_time: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: "下单时间",
      },
      delivery_time: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: "发货时间",
      },
      settlement_time: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "结算时间",
      },
      return_time: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "退货时间",
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "order",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
      ],
    }
  );
};
