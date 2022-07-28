const { Products } = require("../models/product.model");
const { Carts } = require("../models/cart.model");
const { Order } = require("../models/order.model");


const { catchAsync } = require("../utils/catchAsync.util");

const { AppError } = require("../utils/appError.util");
const { productsInCart } = require("../models/productInCart.model");
const { Email } = require("../utils/email.util")

const getUserCart = catchAsync(async (req, res, next) => {
    const { sessionUser } = req;

    const userCart = await Carts.findOne({
        where: { status: "active", userId: sessionUser.id },
        include: [{ model: productsInCart, where: {status: "active"}, include: Products }],
    });

    res.status(200).json({
        status: "success",
        userCart
    });
});

const addProductToCart = catchAsync(async (req, res, next) => {
    const { sessionUser } = req;
    const { productId, quantity } = req.body;

    //check the product doesnt exced the max quantity
    const product = await Products.findOne({
        where: { status: "active", id: productId },
    });

    if (!product) {
        return next(new AppError('Invalid product', 404));
    } else if (quantity > product.quantity) {
        return next(
            new AppError(
            `This product only has ${product.quantity} items available`,
            400
        )
        );
    }

    //check if user have an active cart
    const cart = await Carts.findOne({
        where: { status: "active", userId: sessionUser.id },
    });

    //if product doesnt exist
    if (!cart) {
        // Create new cart for user
        const newCart = await Carts.create({ userId: sessionUser.id });
    
        // Add product to newly created cart
        await productsInCart.create({
            cartId: newCart.id,
            productId,
            quantity
        });
    } else {
        // Cart already exists
        // Check if product already exists in cart
        const productExists = await productsInCart.findOne({
            where: { cartId: cart.id, productId },
        });
    
        if (productExists) {
            return next(new AppError('Product is already in the cart', 400));
        }
    
        await productsInCart.create({
            cartId: cart.id,
            productId, 
            quantity 
        });
    }
    
        res.status(200).json({ status: 'success' });
    });

const updateCartProduct = catchAsync(async (req, res, next) => {
    const { sessionUser } = req;
    const { productId, quantity } = req.body;

    const product = await Products.findOne({
        where: { status: "active", id: productId },
    });

    if (!product) {
        return next(new AppError('Invalid product', 404));
    } else if (quantity > product.quantity) {
        return next(
            new AppError(
            `This product only has ${product.quantity} items available`,
            400
        )
        );
    }

    //find user cart
    const userCart = await Carts.findOne({
        where: { status: "active", userId: sessionUser.id },
    });

    if (!userCart) {
        return next(new AppError("you dont have a cart yet", 404));
    }

    const productInCart = await productsInCart.findOne({
        where: { status: "active", cartId: userCart.id, productId },
    });

    if (!productInCart) {
        return next(new AppError(`cant update product, isnt in the cart yet`, 404));
    }

    if (quantity <= 0) {
        productInCart.update({
        quantity: 0,
        status: "deleted",
    });
    }

    //update product into the cart
    if (quantity > 0) {
        await productInCart.update({ quantity });
    }

    res.status(200).json({
        status: "succes",
    });
});

const removeProductFromCart = catchAsync(async (req, res, next) => {
    const { sessionUser } = req;
    const { productId } = req.params;

    const userCart = await Carts.findOne({
        where: { status: "active", userId: sessionUser.id },
    });

    if (!userCart) {
        return next(new AppError("you dont have a cart yet", 404));
    }

    const productInCart = await productsInCart.findOne({
        where: { status: "active", cartId: userCart.id, productId },
    });

    if (!productInCart) {
        return next(new AppError(`cant update product, isnt in the cart yet`, 404));
    }

    await productInCart.update({ status: "removed", quantity: 0 });

    res.status(200).json({
        status: "succes",
    });
});

const purchaseCart = catchAsync(async (req, res, next) => {
    const { sessionUser } = req;

    const cart = await Carts.findOne({
        where: { userId: sessionUser.id, status: 'active' },
        include: [
        {
            model: productsInCart,
            required: false,
            where: { status: 'active' },
            include: { model: Products },
        },
        ],
    });

    if (!cart) {
        return next(new AppError('Cart not found', 404));
    }

    let totalPrice = 0;

    const productsPurchasedPromises = cart.productsInCarts.map(
        async productInCart => {
        const newQty = productInCart.product.quantity - productInCart.quantity;

        const productPrice =
          productInCart.quantity * + productInCart.product.price;

        totalPrice += productPrice;

        await productInCart.product.update({ quantity: newQty });

        return await productInCart.update({ status: 'purchased' });
        }
    );

    await Promise.all(productsPurchasedPromises);

    await cart.update({ status: 'purchased' })

    const newOrder = await Order.create({
        userId: sessionUser.id,
        cartId: cart.id,
        totalPrice
    })

    await new Email(sessionUser.email).sendNewPurchase(cart.productsInCarts, totalPrice)

    res.status(200).json({
            status: 'success',
            newOrder 
        });
});

module.exports = {
    getUserCart,
    addProductToCart,
    updateCartProduct,
    removeProductFromCart,
    purchaseCart
}