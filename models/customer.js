const mongoose = require('mongoose')


const customerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please Enter your Username'],
        lowercase: true,
        minLength:[5, 'Username is too short!'],
        trim: true
     },
     email:{
        type: String,
        unique: true,
        required:[true, 'Please Enter your Email Address']
     },
     password:{
        type: String,
        required: [true, 'Please Enter your Password'],
        minLength: [6, 'Password is too short!'],
        maxLength: 70,
        trim: true
     },
     emailToken:{
      type: String,
     },
     isVerified:{
        type: Boolean,
     },
   
     date:{
      type: Date,
      default: Date.now()
     }
   
 },{timestamps:true})

 

 const Customer = mongoose.model('customer', customerSchema)

 module.exports = Customer
