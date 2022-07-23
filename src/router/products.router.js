const express = require('express');
const ProductsController = require('../controller/products.controller');

const Validator = require('../middleware/validator.middleware');

const ProductsRouter = express.Router();

//Sub Routes ['/products]
ProductsRouter.get('/',  ProductsController.allProducts)
ProductsRouter.get('/wishlist', ProductsController.getWishlist)
ProductsRouter.get('/:productID',  ProductsController.getProduct)
ProductsRouter.post('/add-to-wishlist' ,ProductsController.addToWishlist)
ProductsRouter.delete('/:productID/delete', Validator.isLoggedin,ProductsController.deleteProduct)
ProductsRouter.post('/create', ProductsController.upload.single('file') ,ProductsController.create)


//Exports
module.exports = ProductsRouter;