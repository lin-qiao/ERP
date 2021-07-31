const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sale', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    sale_sn: {
      type: DataTypes.CHAR(17),
      allowNull: false
    },
    item_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "1、销售单 2、销售退货单"
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "1、已销售  2、已退货"
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
    tableName: 'sale',
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
