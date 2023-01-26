const mongoose = require("mongoose")


const userVerifySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "customer",
        unique: true
     },
     uniqueString:{
        type: String,
     },
     createdAt:{
        type: Date,
        default: Date.now(),
     },
     expiresAt:{
      type: Date
     }
      
 })

 const userVerify = mongoose.model('userVerify', userVerifySchema)

 module.exports = userVerify