const express = require('express')
const dotenv = require('dotenv').config()
const bodyParser = require('body-parser')

const stripe = require('stripe')(process.env.STRIPE_KEY)

const route = express.Router()

route.post('/create-checkout-session', async (req, res) => {

    const customer = await stripe.customers.create({
      metadata:{
        userEmail: req.body.userEmail,
        cart: JSON.stringify(req.body.cartItems)
      }
    })
  const line_items = req.body.cartItems.map((item)=>{
    return {
      price_data:{
        currency: "usd",
        product_data:{
          name: item.name,
          images: [item.image],
          description: item.desc,
          metadata:{
            id: item.id
          }
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity
    }
  })
  
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      shipping_address_collection: {allowed_countries: ['US']},
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
      success_url: `${process.env.CLIENT_URL}/checkout-success`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });
  
    res.status(200).send({url: session.url});
  });

  // stripe webhook

// This is your Stripe CLI webhook secret for testing your endpoint locally.
let endpointSecret ;
// endpointSecret= "whsec_b6c338234835fd598d9037e53a9ca5f966a480611f5e13ca2d3a35f399ac8092";

route.post('/webhook', bodyParser.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];

  let data ;
  let eventType;

  if (endpointSecret) {
    
    let event;
  
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      console.log('Webhook verified');
    } catch (err) {
      console.log(`Webhook Error: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    data = event.data.object;
    eventType = event.type
  } else{
    data = req.body.data.object
    eventType = req.body.type
  }


  // Handle the event
  if (eventType === 'checkout.session.completed') {
     stripe.customers.retrieve(data.customer)
     .then((customer)=>{
      console.log(customer);
      console.log('data:', data); 
     })
     .catch((error)=>{
      console.log(error.message);
    })
  }
  

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).send().end();
});

module.exports = route