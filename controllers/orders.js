const Order = require('../models/order')


exports.getAllOrders = async(req, res)=>{
    try {
        const orders = await Order.find({})
        res.status(200).send(orders)
    } catch (error) {
        res.status(500).send({error: error.message || "server error"})
    }
}


exports.getOrder = async(req, res)=>{
    try {
        const result = await Order.findById({_id: req.params.id})
        if (result) {
           res.status(200).send(result) 
        }
    } catch (error) {
        res.status(400).send(error)
    }
}

exports.deleteOrder = async(req, res)=>{
    try {
        const result = await Order.findByIdAndDelete({_id: req.params.id})
        if (result) {
            res.status(200).send(result)
        }
    } catch (error) {
        res.status(400).send(error)
    }
}

