const router = require('express').Router();
const verifyToken = require('./verifyToken')
const Cart = require('../models/Cart');
const { json } = require('body-parser');


//------------------------------------------create ----------------------------------->

router.post('/', verifyToken.verifyToken, async (req, res) => {
    const newCart = new Cart(req.body);

    try {
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    } catch (err) {
        res.status(500).json(err)
    }
});

// -------------------------------------------update cart----------------------------->

router.put('/:id', verifyToken.verifyTokenAndAutorization, async (req, res) => {
    // console.log('id : ', req.params.id);
    // if (req.body.password) {
    //     req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_SECRET).toString();
    // }
    // console.log("🚀 ~ file: user.js:9 ~ router.put ~ id", req.params.id)

    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        }, {
            new: true
        })

        res.status(200).json(updatedCart)
    } catch (error) {
        res.status(500).json(error)
    }
});


// --------------------------------------------------delete cart----------------------->

router.delete('/:id', verifyToken.verifyTokenAndAutorization, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json('cart deleted successfully');
    } catch (err) {
        res.status(500).json(err);
    }
})



//---------------------------------------------get cart----------------------------------->

router.get('/find/:userId', verifyToken.verifyTokenAndAutorization, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        // const { password, ...others } = user._doc;

        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json(err);
    }
})


//---------------------------------------------get all----------------------------------->

router.get('/', verifyToken.verifyTokenAndAdmin, async (req, res) => {

    try {
        const carts = await Cart.find();
        res.status(200).json(carts);
    } catch (err) {
        res.status(500).json(err);
    }
})
module.exports = router;