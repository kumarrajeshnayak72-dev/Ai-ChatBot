const express = require('express');
const app = express();
const userRoute = require('./routes/auth.route')
const cookie = require('cookie-parser')

app.use(express.json())
app.use('/api/auth',userRoute)
app.use(cookie());

module.exports = app;