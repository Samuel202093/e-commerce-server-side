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
route.get('/customer/verify-email', controller.verifyCustomer)
route.get('/customer/login', controller.loginPage)
route.get('/customers', controller.getCustomers)


//product Api
route.post('/product', upload.single('image'), productController.createProduct)
route.get('/products', productController.getAllProducts)
route.get('/product/:id', productController.getProduct)
route.delete('/product/:id', productController.deleteProduct)
route.put('/product/:id', productController.updateProduct)


 // order Api
//  route.post('/orders', orderController.createOrders)
 route.get('/orders', orderController.getAllOrders)

module.exports = route