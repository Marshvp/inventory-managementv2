const { Router } = require('express')
const indexController = require('../controllers/indexController')

const indexRouter = new Router();

indexRouter.get('/', indexController.homeIndexGet)

indexRouter.get('/addProduct', indexController.addProductGet)

indexRouter.post('/addProduct', indexController.addProductPost)

indexRouter.get('/category/', indexController.categoryIndexGet)

indexRouter.get('/category/:category_name', indexController.categoryFilteredGet)

indexRouter.get('/itemDetails/:id', indexController.itemDetailsGet)

indexRouter.post('/updateQuantity', indexController.updateQuantity)

indexRouter.get('/deleteItem/:id', indexController.deleteItem)


module.exports = indexRouter