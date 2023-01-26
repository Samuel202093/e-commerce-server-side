const Product = require('../models/product')
const Customer = require('../models/customer')
const Cart = require("../models/cart")
// const userVerified = require('../models/userVerify')


exports.addToCart = async(req, res)=>{
    const id = req.params.id
    const output = Customer.findById({_id: id})
    


}


