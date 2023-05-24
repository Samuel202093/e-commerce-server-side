const mongoose = require('mongoose')


const subscribeSchema = new mongoose.Schema({
     email:{
        type: String,
        unique: true,
        required:[true, 'Please Enter your Email Address']
     } 
 },{timestamps:true})

 

 const Subscribe = mongoose.model('subscriber', subscribeSchema)

 module.exports = Subscribe