const router = require('express').Router();
const verifyToken = require('./verifyToken')
const User = require('../models/User')

router.put('/:id', verifyToken.verifyTokenAndAutorization, async (req, res) => {
    // console.log('id : ', req.params.id);
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_SECRET).toString();
    }
    // console.log("🚀 ~ file: user.js:9 ~ router.put ~ id", req.params.id)

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        }, {
            new: true
        })

        res.status(200).json(updatedUser)
    } catch (error) {
        res.status(500).json(error)
    }
});

router.delete('/:id', verifyToken.verifyTokenAndAutorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json('user deleted successfully');
    } catch (err) {
        res.status(500).json(err);
    }
})



//---------------------------------------------get one user----------------------------------->

router.get('/find/:id', verifyToken.verifyTokenAndAutorization, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;

        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
})


//---------------------------------------------get all users----------------------------------->

router.get('/', verifyToken.verifyTokenAndAutorization, async (req, res) => {
    const query = req.query.new;

    try {
        const users = query ? await User.find().limit(5).sort({ _id: -1 }) : await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
})

//---------------------------------------------get users stats----------------------------------->

router.get('/stats', verifyToken.verifyTokenAndAutorization, async (req, res) => {
    const date = new Date();
    const lastyear = new Date(date.setFullYear(date.getFullYear() - 1));

    try {
        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastyear } } },
            {
                $project: {
                    month: { $month: '$createdAt' }
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 }
                },
            }
        ])
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;