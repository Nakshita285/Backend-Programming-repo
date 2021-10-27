const mongoose = require('mongoose');
let { DB_LINK } = require('../secrets');

mongoose.connect(DB_LINK, {
    useNewUrlParser:true,
    // useUnifiedTopology:true 
})
.then(function(database){
    console.log("Database is Connected with server for Reviews!");
}).catch(function(error){
    console.log("ERROR: " + error);
})

const reviewSchema = new mongoose.Schema({
    review :{
        type: String,
        required:[true, "Reviews can't be empty"]
    },
    rating:{
        type: Number,
        required:[true,"Ratings matters"],
        min: 1,
        max: 5
    },
    createdAt:{
        type: Date,
        delfault: Date.now
    },
    // User Id and Plan Id should get saved In Reviews 
    // We should know who the user is and which plan it refers to that user 
    // Review must belong to User
    user :{
        type: mongoose.Schema.Types.ObjectId,
        ref:"userModel",
        required:[true, "Reviews should belong to the User"]
    },
    plan:{
        // type and ref required 
        type: mongoose.Schema.Types.ObjectId,
        ref:"planModel",
        required:[true,"reviews should belong to the Plan"]
    }
})


const reviewModel = new mongoose.model('reviewModel', reviewSchema);

module.exports = reviewModel;