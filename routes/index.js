const express = require('express')
const controller = require('../controllers/customer')
const { verifyEmail } = require('../utils/JWT')
const productController = require('../controllers/product')
const { upload } = require('../utils/cloudinary')
const dotenv = require('dotenv').config()
const bodyParser = require('body-parser')

const route = express.Router()

// customer registration, verification and login Api
route.post('/customer/register', controller.createCustomer)
route.post('/customer/login', verifyEmail, controller.loginCustomer)
route.get('/customer/verify-email', controller.verifyCustomer)
route.get('/customer/login', controller.loginPage)


//product Api
route.get('/products', productController.getAllProducts)
route.delete('/product/:id', productController.deleteProduct)
route.get('/product/:id', productController.getProduct)
route.post('/product', upload.single('image'), productController.createProduct)
route.get('/success', productController.Success)

 

module.exports = route