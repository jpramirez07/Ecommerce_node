const { Products } = require("../models/product.model");
const { Carts } = require("../models/cart.model");
const { Category } = require("../models/category.model");

const { catchAsync } = require("../utils/catchAsync.util");

const { AppError } = require("../utils/appError.util");
const { User } = require("../models/user.model");

const createNewProduct = catchAsync(async (req, res, next) => {
    const { title, description, quantity, price, categoryId } = req.body;
    const { sessionUser } = req; //logged user id

    const newProduct = await Products.create({
        title,
        description,
        quantity,
        price,
        categoryId,
        userId: sessionUser.id, //take the id by logged user
    });

    res.status(200).json({
        status: "success",
        newProduct
    });
});

const getAllProducts = catchAsync(async (req, res, next) => {
    const products = await Products.findAll({
        where: { status: "active" }
    });

    res.status(200).json({
        status: "success",
        products
    });
});

const getProductById = catchAsync(async (req, res, next) => {
    const { product } = req;

    res.status(200).json({
        status: "success",
        product,
    });
});

const updateProduct = catchAsync(async (req, res, next) => {
    const { product } = req;

    const { title, description, price, quantity } = req.body

    await product.update({
        title,
        description,
        price,
        quantity
    });

    res.status(200).json({
        status: "success"
    });
});

const deleteProduct = catchAsync(async (req, res, next) => {
    const { product } = req;

    await product.update({ status: "removed" });

    res.status(200).json({
        status: "success",
    });
});

const getAllCategories = catchAsync(async (req, res, next) => {
    const categories = await Category.findAll({
        where: { status: "active" },
        include: Products
    });

    res.status(200).json({
        status: "success",
        categories
    });
});

const createCategories = catchAsync(async (req, res, next) => {
    const { name } = req.body;

    const newCategory = await Category.create({
        name
    });

    res.status(200).json({
        status: "success",
        newCategory
    });
});

const updateCategories = catchAsync(async (req, res, next) => {
    const { category } = req
    const { name } = req.body

    await category.update({
        name
    });

    res.status(200).json({
        status: "success"
    });
});


module.exports = {
    createNewProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getAllCategories,
    createCategories,
    updateCategories
}