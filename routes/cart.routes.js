const express = require('express');

// Controllers
const {
    getUserCart,
    addProductToCart,
    updateCartProduct,
    purchaseCart,
    removeProductFromCart,
} = require('../controllers/cart.controller');

// Middlewares
const { protectSession } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protectSession);

router.get('/', getUserCart);

router.post('/add-product', addProductToCart);

router.patch('/update-cart', updateCartProduct);

router.post('/purchase', purchaseCart);

router.delete('/:productId', removeProductFromCart);

module.exports = { cartRouter: router };
