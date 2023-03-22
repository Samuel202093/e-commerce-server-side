const express = require('express')
const dotenv = require('dotenv').config()
const bodyParser = require('body-parser')
const Order = require('../models/order')


const stripe = require('stripe')(process.env.STRIPE_KEY)

const route = express.Router()




route.post('/create-checkout-session', async (req, res) => {

    const customer = await stripe.customers.create({
      metadata:{
        userEmail: req.body.userEmail,
      }
    })
  const line_items = req.body.cartItems.map((item)=>{
    return {
      price_data:{
        currency: "usd",
        product_data:{
          name: item.name,
          images: [item.imageUrl],
          
        },
        unit_amount: item.price * 100,
      },
      quantity: item.cartQuantity
    }
  })
  
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      shipping_address_collection: {allowed_countries: ['US', 'CA','NG', 'GB']},
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {amount: 0, currency: 'usd'},
            display_name: 'Free shipping',
            delivery_estimate: {
              minimum: {unit: 'business_day', value: 5},
              maximum: {unit: 'business_day', value: 14},
            },
          },
        },
      ],
      phone_number_collection:{
        enabled: true
      },
      customer:customer.id,  
      line_items,
      mode: 'payment',
      success_url: `https://hi-gadget-3d16b.web.app/checkout-success`,
      cancel_url: `https://hi-gadget-3d16b.web.app/cart`,
    });
  
    res.status(200).send({url: session.url});
  });

  //creating the order function
  const createOrder = async(customer, data, lineItems)=>{
    const newOrder = new Order({
      userId: customer.metadata.userId,
      customerId: data.customer,
      paymentIntentId: data.payment_intent,
      products: lineItems.data,
      subtotal: data.amount_subtotal,
      total: data.amount_total,
      shipping: data.customer_details,
      payment_status: data.payment_status
    })
    try {
      const savedOrder = await newOrder.save()
      console.log('Processed Order:', savedOrder);
    } catch (error) {
      console.log(error);
    }
  }

  // server.js

route.post("/webhook", bodyParser.raw({type: "application/json"}), async(req, res)=>{

  //signature verification
  const payload = req.body
  const sig = req.headers['stripe-signature']
  const endpointSecret = process.env.STRIPE_ENDPOINTSECRET

  let event;
  let data;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret)
  } catch (error) {
    console.log(error.message);
    res.status(400).json({success: false})
    return;
  }

  data = event.data.object

  // Handling Events 
  if (event.type === 'checkout.session.completed') {
    stripe.customers.retrieve(data.customer)
    .then((customer)=>{
      stripe.checkout.sessions.listLineItems(data.id, {}, (err, lineItems)=>{
        createOrder(customer, data, lineItems)
      })
    
    })
    .catch((err)=> console.log(err.message))
  }

  res.json({success: true})

})












module.exports = route