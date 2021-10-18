// require mongoose 
const mongoose = require('mongoose');
let {DB_LINK} = require('../secrets');
const userModel = require('./userModel');

// connect with server
mongoose.connect(DB_LINK,{})
.then(function(){
    console.log("Database is connected to the server for plans!");
})
.catch(function(error){
    console.log("error" + error);
})

// plan schema 
const planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true,
    },
    duration: {
        type: Number,
        required: true
    },
    ratingAverage:{
        type: Number
    },
    discount: {
        type:Number,
        validate: {
            validator: function(){
                    return this.discount < this.price;
                },

            message: "Discount should be less than PriceList"
        }
    }
})

const planModel = new mongoose.model("planModel",planSchema);



module.exports = planModel;

