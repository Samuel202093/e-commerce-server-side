const Product = require('../models/product')
const path = require('path')
const Customer = require('../models/customer')
const { cloudinary } = require("../utils/cloudinary")


// Uploading a product
exports.createProduct = async(req, res)=>{
    try {
        const result = await cloudinary.uploader.upload(req.file.path)
       const { name, description, category, price} = req.body
        const newProduct = new Product({
            name: name,
            description: description,
            category: category,
            price: price,
            imageUrl: result.secure_url,
            cloudinary_id: result.public_id
        })
        const product = await newProduct.save()
        res.status(200).send(product)

    } catch (error) {
        res.status(500).send({message:error.message || "Server Error"})
    }
}


// Getting all products from database
exports.getAllProducts = async(req, res)=>{
    try {
        const product = await Product.find({})
        if (!product) {
            res.status(400).send({message:error.message || "Error getting products from database"})
        }
        else{
            res.status(200).send(product)
        }

    } catch (error) {
        res.status(500).send({message:error.message || "Server Error"}) 
    }
}

// Getting a single product
exports.getProduct = async(req, res)=>{
    try {
       const id = req.params.id
       const result = await Product.findById({_id: id}) 

        if (!result) {
            res.status(400).send({message:error.message || "Error getting single product from database"})
        } 
        else {
            res.status(200).send(result)
        }

    } catch (error) {
        res.status(500).send({message:error.message || "Server Error"})
    }
}

exports.deleteProduct = async(req, res)=>{
    try {
        const result = Product.findByIdAndDelete({_id: req.params.id})
        if (result) {
            res.status(200).send(result)
        } else {
          res.status(400).send({message: error.message || "Cannot Delete that product"})  
        }
    } catch (error) {
        res.status(500).send({message: error.message || "Server Error"})
    }
}

exports.addToCart = async(req, res)=>{
    try {
        
    } catch (error) {
        
    }
}

exports.Success = (req, res)=>{
    try {
        res.status(200).send("Successfully stripe payment gateway")
    } catch (error) {
        res.status(400).send('Error')
    }
}




