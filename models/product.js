const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String
    }, 
    price:{
        type: String
    },
    category:{
        type: String
    },
    imageUrl:{
        type: String
    },
    cloudinary_id:{
        type: String
    },
}, {timestamps: true})

const Product = mongoose.model('product', productSchema)

module.exports = Product