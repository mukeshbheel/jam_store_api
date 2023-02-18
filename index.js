const express = require('express');
const app = express();
const dotenv = require('dotenv');
const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')
const productRoute = require('./routes/product')
const cartRoute = require('./routes/cart')
const orderRoute = require('./routes/order')
const cors = require("cors")

dotenv.config();
app.use(express.json());
app.use(cors());

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('Database Connected');
}).catch(err => console.log(err));


app.use('/api/auth/', authRoute);
app.use('/api/users/', userRoute);
app.use('/api/products/', productRoute);
app.use('/api/cart/', cartRoute);
app.use('/api/Orders/', orderRoute);



app.listen(process.env.PORT || 5000, () => {
    console.log('Backend server is running.');
})