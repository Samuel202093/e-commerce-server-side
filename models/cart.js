const mongoose = require("mongoose")


const cartSchema = new mongoose.Schema({
   
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'product',
        unique: true,
    },
    quantity:{
        type: Number
    }
}, {timestamps:true} )

const Cart = mongoose.model('cart', cartSchema)

module.exports = Cart