const jwt = require('jsonwebtoken')
const cookie = require('cookie-parser')
const Customer = require('../models/customer')


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
        if(user.isVerified){
            res.status(201).send('Customer is verified')
            next()
        }
    } catch (error) {
        console.log("please check your email to verify your account");
    }
}


module.exports = { loginrequired, verifyEmail }