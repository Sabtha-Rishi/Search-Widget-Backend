// Built in Imports
const express = require('express');
const AccountsRouter = express.Router()

// Controllers
const AccountsController = require('../controller/accounts.controller')

//Middlewares

const ValidatorMiddleware = require('../middleware/validator.middleware')


//Routes
AccountsRouter.post('/register', AccountsController.createUser);
AccountsRouter.post('/login', AccountsController.loginUser);
AccountsRouter.post('/logout', AccountsController.logoutUser);
AccountsRouter.delete('/delete', ValidatorMiddleware.isLoggedin, AccountsController.deleteUser);
AccountsRouter.get('/user',ValidatorMiddleware.isLoggedin, AccountsController.getUser);
AccountsRouter.post('/changepassword', ValidatorMiddleware.isLoggedin, AccountsController.changePassword);



module.exports = AccountsRouter;