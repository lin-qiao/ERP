const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('purchase', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    purchase_sn: {
      type: DataTypes.CHAR(17),
      allowNull: false,
      comment: "采购单号"
    },
    supplier_name: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "进货商名称"
    },
    supplier_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "进货商id"
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "1、已采购 2、已撤销"
    },
    item_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "1、采购单 2、采购退货单"
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
    tableName: 'purchase',
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
