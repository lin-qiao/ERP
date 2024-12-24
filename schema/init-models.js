var DataTypes = require("sequelize").DataTypes;
var _bill = require("./bill");
var _bill_goods = require("./bill_goods");
var _brand = require("./brand");
var _business_flow = require("./business_flow");
var _category = require("./category");
var _goods = require("./goods");
var _purchase = require("./purchase");
var _purchase_goods = require("./purchase_goods");
var _sale = require("./sale");
var _sale_goods = require("./sale_goods");
var _size = require("./size");
var _stock = require("./stock");
var _storage = require("./storage");
var _storage_goods = require("./storage_goods");
var _supplier = require("./supplier");
var _user = require("./user");

function initModels(sequelize) {
  var bill = _bill(sequelize, DataTypes);
  var bill_goods = _bill_goods(sequelize, DataTypes);
  var brand = _brand(sequelize, DataTypes);
  var business_flow = _business_flow(sequelize, DataTypes);
  var category = _category(sequelize, DataTypes);
  var goods = _goods(sequelize, DataTypes);
  var purchase = _purchase(sequelize, DataTypes);
  var purchase_goods = _purchase_goods(sequelize, DataTypes);
  var sale = _sale(sequelize, DataTypes);
  var sale_goods = _sale_goods(sequelize, DataTypes);
  var size = _size(sequelize, DataTypes);
  var stock = _stock(sequelize, DataTypes);
  var storage = _storage(sequelize, DataTypes);
  var storage_goods = _storage_goods(sequelize, DataTypes);
  var supplier = _supplier(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);


  return {
    bill,
    bill_goods,
    brand,
    business_flow,
    category,
    goods,
    purchase,
    purchase_goods,
    sale,
    sale_goods,
    size,
    stock,
    storage,
    storage_goods,
    supplier,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
