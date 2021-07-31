const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    mobile: {
      type: DataTypes.CHAR(11),
      allowNull: false,
      comment: "手机号"
    },
    nick_name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: "昵称"
    },
    password: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "密码"
    }
  }, {
    sequelize,
    tableName: 'user',
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
