const express = require('express');

// Controllers
const {
    getAllProducts,
    getProductById,
    createNewProduct,
    updateProduct,
    deleteProduct,
    getAllCategories,
    createCategories,
    updateCategories
} = require('../controllers/product.controller');

// Middlewares
const { protectSession } = require('../middlewares/auth.middleware');
const {
    createProductValidations,
    checkValidations,
} = require('../middlewares/validations.middleware');
const {
    protectProductOwner,
    productExists,
} = require('../middlewares/product.middleware');
const { categoryExists } = require('../middlewares/category.middleware')

const { upload } = require('../utils/upload.util')

const router = express.Router();

router.get('/', getAllProducts);

router.get('/categories', getAllCategories);

router.get('/:id', productExists, getProductById);

router.use(protectSession);

router.post('/', upload.array('productImg', 5),createProductValidations, checkValidations, createNewProduct);

router.post('/categories', createCategories);

router.patch('/categories/:id', categoryExists, updateCategories);

router
    .use('/:id', productExists)
    .route('/:id')
    .patch(protectProductOwner, updateProduct)
    .delete(protectProductOwner, deleteProduct);

module.exports = { productsRouter: router };