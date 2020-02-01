const express = require('express');
const mongoose = require('mongoose');
require('dotenv/config');
// const cors = require('cors');

// Routes
const userRoute = require('./routes/user');

// DB Connection

mongoose.connect(
    process.env.BD_CONNECTION, 
    { 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    }
).catch(error => console.log(error));

// Middlewares
const app = express();
app.listen(3000);
// app.use(cors());
app.use(express.json());
app.use('/api/user', userRoute);
