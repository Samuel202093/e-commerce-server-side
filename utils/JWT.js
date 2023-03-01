const jwt = require('jsonwebtoken')
const cookie = require('cookie-parser')
const Customer = require('../models/customer')
const dotenv = require('dotenv').config()

const admin = {
    name:process.env.ADMIN_NAME,
    password: process.env.ADMIN_PASSWORD
  }


const loginrequired = async(req, res, next)=>{
    const token = req.cookies["access-token"]
    if (token) {
        const validatetoken = await jwt.verify(token, process.env.TOKEN_KEY)
        if (validatetoken) {
            res.user = validatetoken.id
            next()
        }
        else{
            console.log('token expires');
            res.redirect('/customer/login')

        }
    }
    else{
        console.log('token not found');
        res.redirect('/customer/login')
    }
}

const verifyEmail = async(req, res, next)=>{
    try {
        const user = await Customer.findOne({email: req.body.email})
        const adminOutput = {email: admin.name}

        if (req.body.email === admin.name && req.body.password === admin.password) {
            console.log(adminOutput);
          return  res.status(203).send(adminOutput)
        }
        else if(user.isVerified){
          return  res.status(200).send(user)
            next()
        }
    } catch (error) {
        console.log("please check your email to verify your account");
    }
}


module.exports = { loginrequired, verifyEmail }