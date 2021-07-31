var DataTypes = require("sequelize").DataTypes;
var _brand = require("./brand");
var _business_flow = require("./business_flow");
var _goods = require("./goods");
var _purchase = require("./purchase");
var _purchase_goods = require("./purchase_goods");
var _sale = require("./sale");
var _sale_goods = require("./sale_goods");
var _size = require("./size");
var _stock = require("./stock");
var _supplier = require("./supplier");
var _user = require("./user");

function initModels(sequelize) {
  var brand = _brand(sequelize, DataTypes);
  var business_flow = _business_flow(sequelize, DataTypes);
  var goods = _goods(sequelize, DataTypes);
  var purchase = _purchase(sequelize, DataTypes);
  var purchase_goods = _purchase_goods(sequelize, DataTypes);
  var sale = _sale(sequelize, DataTypes);
  var sale_goods = _sale_goods(sequelize, DataTypes);
  var size = _size(sequelize, DataTypes);
  var stock = _stock(sequelize, DataTypes);
  var supplier = _supplier(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);


  return {
    brand,
    business_flow,
    goods,
    purchase,
    purchase_goods,
    sale,
    sale_goods,
    size,
    stock,
    supplier,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
