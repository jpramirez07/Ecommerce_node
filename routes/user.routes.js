const express = require('express');

// Middlewares
const {
    userExists,
    protectAccountOwner
} = require('../middlewares/user.middleware');
const { protectSession } = require('../middlewares/auth.middleware');
const {
    createUserValidations,
    checkValidations,
} = require('../middlewares/validations.middleware');

// Controller
const {
    createNewUser,
    loginUser,
    getUserProducts,
    updateUser,
    deleteUser,
    getUserOrders,
    getUserOrderById,
    checkToken,
    getAllUsers
} = require('../controllers/user.controller');

const router = express.Router();

router.post('/', createUserValidations, checkValidations, createNewUser);

router.post('/login', loginUser);

router.use(protectSession);

router.get('/', getAllUsers);

router.get('/me', getUserProducts);

router.get('/orders', getUserOrders);

router.get('/orders/:id', getUserOrderById);

router.get('/check-token', checkToken);

router
    .route('/:id')
    .patch(userExists, protectAccountOwner, updateUser)
    .delete(userExists, protectAccountOwner, deleteUser);

module.exports = { usersRouter: router };
