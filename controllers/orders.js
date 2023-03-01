const Order = require('../models/order')


exports.getAllOrders = async(req, res)=>{
    try {
        const orders = await Order.find({})
        res.status(200).send(orders)
    } catch (error) {
        res.status(500).send({error: error.message || "server error"})
    }
}


