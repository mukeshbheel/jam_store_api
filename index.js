const express = require('express');
const app = express();
const dotenv = require('dotenv');
const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')

dotenv.config();
app.use(express.json());

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('Database Connected');
}).catch(err => console.log(err));


app.use('/api/auth/', authRoute);
app.use('/api/user/', userRoute);



app.listen(process.env.PORT || 5000, () => {
    console.log('Backend server is running.');
})