const express = require("express");
const cookieParser= require('cookie-parser');
const app=express();


// to use the body from the postman
app.use(express.json());
// allows the file to seen in public on the UI
app.use(express.static('public'));
app.use(cookieParser());

const userRouter= require('./Routers/userRouter');
const authRouter= require('./Routers/authRouter');
const planRouter = require('./Routers/planRouter');
const reviewRouter = require('./Routers/reviewRouter');

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/plan', planRouter);
app.use('/api/review', reviewRouter);

app.listen(8080, function(){
    console.log("the server started");
})

