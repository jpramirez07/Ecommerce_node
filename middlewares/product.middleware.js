// Models
const { Products } = require('../models/product.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');
const { ProductImg } = require('../models/productIms.model');

const productExists = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const product = await Products.findOne({ where: { id, status: 'active' }, include: ProductImg });

    if (!product) {
    return next(new AppError('Could not find product by given id', 404));
    }

    req.product = product;
    next();
});

const protectProductOwner = catchAsync(async (req, res, next) => {
    // Get current session user and the user that is going to be updated
    const { sessionUser, product } = req;

    // Compare the id's
    if (sessionUser.id !== product.userId) {
        // If the ids aren't equal, return error
        return next(new AppError('You do not own this account', 403));
    }
    next();
});

module.exports = { protectProductOwner, productExists };
