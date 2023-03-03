const Customer = require("../models/customer")
const userVerify = require('../models/userVerify')
const dotenv = require('dotenv').config()
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer")
const {v4: uuidv4} = require ("uuid")
const cookie = require('cookie-parser')
const crypto = require('crypto') 

const admin = {
  name:process.env.ADMIN_NAME,
  password: process.env.ADMIN_PASSWORD
}
 
const createToken = (user)=>{
  const token = jwt.sign({
    _id: user._id, 
    name: user.name, 
    email: user.email}, 
    process.env.TOKEN_KEY
    )
    return token;
}


// nodemailer handler
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth:{
      user: process.env.USER,
      pass: process.env.PASSWORD

  },
  tls:{
    rejectUnauthorized: false
  }
})





exports.createCustomer = async(req, res)=>{
    try {
        const {username, email, password} = req.body
        if (!(username && email && password)) {
          return res.status(400).send({ error: "Data not formatted properly" });
        }
      
        const user = new Customer({
          username: username,
          email: email,
          password: password,
          emailToken: crypto.randomBytes(64).toString('hex'), 
          isVerified: false
        });
      
        // generate salt to hash password
        const salt = await bcrypt.genSalt(10);
      
        // now we set user password to hashed password
        const hashPassword = await bcrypt.hash(user.password, salt);
        user.password = hashPassword
      

          let mailOptions = {
            from: ` "Verify Your Email" <Nayastores@gmail.com`,
            to: user.email,
            subject: 'Naya Stores -Verify your email',
            html: `<h2>Hello ${user.username}! Thanks for registering on our site </h2>
            <h4> Please verify your email with the link below to continue...</h4>
            <a href ="http://${req.headers.host}/customer/verify-email?token=${user.emailToken}">Verify Your Email </a>
            `
          }

          transporter.sendMail(mailOptions, (error, info)=>{
            if(error){
              console.log(error);
            }
            else{
              console.log('Verification email is sent to your email account');
            }
          })

        const newUser = user.save()
        newUser.then((data)=>{
          res.status(200).send(data)

        })

        // const token = createToken(newUser)


        
    } catch (error) {
        res.status(500).send(error)
    }
}



exports.verifyCustomer= async(req, res)=>{
    try {
        const token = req.query.token
        const user = await Customer.findOne({ emailToken: token})
        if (user) {
          user.emailToken = token
          user.isVerified = true
          await user.save()
          res.status(200).end()
        }
        else{
          res.redirect('/customer/register')
          console.log("email is not verified");
        }
    } catch (error) {
      res.status(500)
    }
}

exports.loginCustomer = async(req, res)=>{
  const { email, password } = req.body
  const user = await Customer.findOne({ email: email})
  const adminOutput = {email: admin.name}

  if (req.body.email === admin.name && req.body.password === admin.password)  {
    // console.log(adminOutput);
    res.status(205).send(adminOutput)
  }

  else if (user) {
    const validPassword = await bcrypt.compare(password, user.password)
    if (validPassword) {
     return res.status(200).send(user)
    }
  }
  else{
    res.status(400).send({error: 'user does not exist'})
  }
}

exports.getCustomers = async(req, res)=>{
  try {
    const customer = await Customer.find({})
    if (!customer) {
        res.status(400).send({message:error.message || "Error getting products from database"})
    }
    else{
        res.status(200).send(customer)
    }

} catch (error) {
    res.status(500).send({message:error.message || "Server Error"}) 
}
}

// exports.loginCustomer = async(req, res)=>{
//   const {email, password} = req.body
//   const user = await Customer.findOne({ email: email })
//   console.log(user);
//   // if(user.isVerified === false){
//   //   res.status(300)
//   // }

//   if ((email == admin.email && password == admin.password)) {

//     res.status(205).send('Welcome to the Admin Page')

//   } else if (user) {
//      // check user password with hashed password stored in the database

//      const validPassword = await bcrypt.compare(password, user.password);
//       console.log(2);
//      if (validPassword) {
//       console.log(1);
//       // const token = createToken(user.emailToken)
//       // console.log(token);
//       // res.cookie('access-token', token)
//         res.status(200).json(user);
       
//      } else {
//        res.status(400).json({ error: "email or Password is not correct" });
//      }

//   } else {
//     res.status(401).json({ error: "User does not exist" })
//   }
// }

exports.loginPage = async(req, res)=>{
  try {
    
      res.status(200).send(`Welcome`)
    
  } catch (error) {
    res.status(500)
  }
}

