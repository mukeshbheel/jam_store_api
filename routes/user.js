const router = require('express').Router();
const { verifyTokenAndAuthorization } = require('./verifyToken')
const User = require('../models/User')

router.put('/:id', verifyTokenAndAuthorization, (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_SECRET).toString();
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.body.id, {
            $set = req.body,
        }, {
            new: true
        })
        res.status(200).json(updatedUser)
    } catch (error) {
        res.status(500).json(error)
    }
});

module.exports = router;