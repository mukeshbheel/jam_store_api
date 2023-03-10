const router = require('express').Router();
const verifyToken = require('./verifyToken')
const Order = require('../models/Order');
const { json } = require('body-parser');


//------------------------------------------create ----------------------------------->

router.post('/', verifyToken.verifyToken, async (req, res) => {
    const newOrder = new Order(req.body);

    try {
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    } catch (err) {
        res.status(500).json(err)
    }
});

// -------------------------------------------update order----------------------------->

router.put('/:id', verifyToken.verifyTokenAndAdmin, async (req, res) => {

    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        }, {
            new: true
        })

        res.status(200).json(updatedOrder)
    } catch (error) {
        res.status(500).json(error)
    }
});


// --------------------------------------------------delete order----------------------->

router.delete('/:id', verifyToken.verifyTokenAndAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json('Order deleted successfully');
    } catch (err) {
        res.status(500).json(err);
    }
})



//---------------------------------------------get Order----------------------------------->

router.get('/find/:userId', verifyToken.verifyTokenAndAutorization, async (req, res) => {
    try {
        const order = await Order.find({ userId: req.params.userId });
        // const { password, ...others } = user._doc;

        res.status(200).json(order);
    } catch (err) {
        res.status(500).json(err);
    }
})


//---------------------------------------------get all----------------------------------->

router.get('/', verifyToken.verifyTokenAndAdmin, async (req, res) => {

    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json(err);
    }
})

//-------------------------------get montly income--------------------->

router.get("/income", verifyToken.verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    try {
        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: previousMonth } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount",
                },

                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" }
                },

            }

        ]);
        res.status(200).json(income);
    } catch (error) {
        res.status(500).json(error);
    }

})




module.exports = router;