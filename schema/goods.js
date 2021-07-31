const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('goods', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "名称"
    },
    good_sn: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "货号"
    },
    img_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "图片"
    },
    brand_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "品牌Id"
    },
    size_ids: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "尺码id"
    },
    purchase_price: {
      type: DataTypes.DOUBLE(20,2),
      allowNull: false,
      comment: "采购价"
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
    tableName: 'goods',
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
