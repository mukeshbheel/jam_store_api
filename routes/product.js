const router = require('express').Router();

const verifyToken = require('./verifyToken')
const Product = require('../models/product');
const { json } = require('body-parser');


//------------------------------------------create ----------------------------------->

router.post('/', verifyToken.verifyTokenAndAdmin, async (req, res) => {
    const newProduct = new Product(req.body);

    try {
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    } catch (err) {
        res.status(500).json(err)
    }
});

// -------------------------------------------update product----------------------------->

router.put('/:id', verifyToken.verifyTokenAndAdmin, async (req, res) => {
    // console.log('id : ', req.params.id);
    // if (req.body.password) {
    //     req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_SECRET).toString();
    // }
    // console.log("🚀 ~ file: user.js:9 ~ router.put ~ id", req.params.id)

    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        }, {
            new: true
        })

        res.status(200).json(updatedProduct)
    } catch (error) {
        res.status(500).json(error)
    }
});


// --------------------------------------------------delete product----------------------->

router.delete('/:id', verifyToken.verifyTokenAndAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json('product deleted successfully');
    } catch (err) {
        res.status(500).json(err);
    }
})



//---------------------------------------------get one product----------------------------------->

router.get('/find/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        // const { password, ...others } = user._doc;

        res.status(200).json(product);
    } catch (err) {
        res.status(500).json(err);
    }
})


//---------------------------------------------get all products----------------------------------->

router.get('/', async (req, res) => {
    const qnew = req.query.new;
    const qcategory = req.query.category;

    try {
        let products;

        if (qnew) {
            products = await Product.find().sort({ createdAt: -1 }).limit(1);
        } else if (qcategory) {
            products = await Product.find({
                categories: {
                    $in: [qcategory]
                }
            });
        } else {
            products = await Product.find();
        }
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json(err);
    }
})


module.exports = router;