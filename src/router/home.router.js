// Built in Imports
const express = require('express');
const HomeRouter = express.Router()

// Controllers
const HomeController = require('../controller/home.controller')


//Routes
HomeRouter.get('/', HomeController);



module.exports = HomeRouter;