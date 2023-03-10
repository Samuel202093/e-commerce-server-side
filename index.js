const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const cookieparser = require('cookie-parser')
const port = 8080 || process.env.PORT
const connection = require('./db/db')
const products = require('./product')

const routes = require('./routes/index')
const stripeRoute = require('./routes/stripe')


const app = express()

dotenv.config()

// connecting the database
connection()

// middlewares for Api calls
app.use(cors())
app.use(cookieparser())


app.use((req, res, next)=>{
    if (req.originalUrl === '/webhook') {
        next()
    }else{
        express.json()(req, res, next)
    }
  })

  app.use(express.urlencoded({extended: true}))



app.use('/', routes)
app.use('/', stripeRoute)

//to get default products
app.get('/static/products', (req, res)=>{
    res.status(200).send(products)
})

app.listen(port, ()=>{
    console.log(`server running on port ${port}`);
})