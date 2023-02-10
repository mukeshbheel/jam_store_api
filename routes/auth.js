const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');




// Register

router.post('/register', async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_SECRET).toString(),
    });
    console.log("🚀 ~ file: auth.js:16 ~ router.post ~ newUser", newUser)

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json(err);
    }
})


// Login

router.post('/login', async (req, res) => {

    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            res.status(401).json('Wrong credentials!');
            return;
        }

        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASSWORD_SECRET);
        const originaPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        console.log("🚀 ~ file: auth.js:35 ~ router.post ~ password", originaPassword)


        if (originaPassword != req.body.password) {
            res.status(401).json('Wrong credentials!');
            return;
        }

        const accessToken = jwt.sign(
            {
                id: user.id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SECRET,
            { expiresIn: "3d" }
        )

        const { password, ...others } = await user._doc;
        res.status(200).json({ ...others, accessToken });

    } catch (err) {
        res.status(500).json(err);
        console.log("🚀 ~ file: auth.js:57 ~ router.post ~ err", err)
    }
});



module.exports = router;