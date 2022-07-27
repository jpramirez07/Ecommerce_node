const { Carts } = require("../models/cart.model");
const { User } = require("../models/user.model");
const { Products } = require("../models/product.model");
const { Order } = require("../models/order.model");
const { productsInCart } = require("../models/productInCart.model");
const { Category } = require("../models/category.model");
const { ProductImg } = require("../models/productIms.model");

const initModels = () => {
    // 1 User <--> M Product
    User.hasMany(Products);
    Products.belongsTo(User);

    // 1 User <--> M Order
    User.hasMany(Order);
    Order.belongsTo(User);

    // 1 User <--> 1 Cart
    User.hasOne(Carts);
    Carts.belongsTo(User);

    // 1 Product <--> M ProductImg
    Products.hasMany(ProductImg);
    ProductImg.belongsTo(Products);

    // 1 Category <--> 1 Product
    Category.hasOne(Products);
    Products.belongsTo(Category);

    // 1 Cart <--> M ProductInCart
    Carts.hasMany(productsInCart);
    productsInCart.belongsTo(Carts);

    // 1 Product <--> 1 ProductInCart
    Products.hasOne(productsInCart);
    productsInCart.belongsTo(Products);

    // 1 Order <--> 1 Cart
    Carts.hasOne(Order);
    Order.belongsTo(Carts);
};

module.exports = { initModels };