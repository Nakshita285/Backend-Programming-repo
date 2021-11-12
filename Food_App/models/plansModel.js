// require mongoose 
const mongoose = require('mongoose');
let {DB_LINK} = require('../secrets');
const userModel = require('./userModel');

// connect with server
mongoose.connect(DB_LINK,{
    useNewUrlParser:true, 
    // useUnifiedTopology:true
})
.then(function(){
    console.log("Database is Connected with server for Plans!");
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
    discount: {
        type:Number,
        validate: {
            validator: function(){
                    return this.discount < this.price;
                },

            message: "Discount should be less than PriceList"
        }
    },
    reviews: {
        // have the array for the id of reviews     
        type: [mongoose.Schema.Types.objectId],
        ref:"reviewModel"
    },
    averageRating: Number
})

const planModel = new mongoose.model("planModel",planSchema); 
// ref: "planModel" for reviewModel and review Schema 




module.exports = planModel;

