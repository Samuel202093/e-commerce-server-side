const express = require('express')
const controller = require('../controllers/customer')
const { verifyEmail } = require('../utils/JWT')
const productController = require('../controllers/product')
const orderController = require('../controllers/orders')
const { upload } = require('../utils/cloudinary')
const dotenv = require('dotenv').config()
const bodyParser = require('body-parser')

const route = express.Router()

// customer registration, verification and login Api
route.post('/customer/register', controller.createCustomer)
route.post('/customer/login', verifyEmail, controller.loginCustomer)
route.post('/customer/verify-email/:token', controller.verifyCustomer)
route.delete('/customer/:id', controller.deleteCustomer)
route.get('/customer/login', controller.loginPage)
route.get('/customers', controller.getCustomers)


//product Api
route.post('/product', upload.single('image'), productController.createProduct)
route.get('/products', productController.getAllProducts)
route.get('/product/:id', productController.getProduct)
route.delete('/product/:id', productController.deleteProduct)
route.put('/product/:id', productController.updateProduct)


 // order Api

 route.get('/orders', orderController.getAllOrders)
 route.get('/order/:id', orderController.getOrder)

module.exports = route