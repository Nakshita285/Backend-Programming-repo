// Server <--> Mongoose <--> MongoDB

const mongoose = require('mongoose');
let { DB_LINK } = require('../secrets');

const validator = require('email-validator');

// connect server to the Mongoose       
                                        // now we dont need this
mongoose.connect(DB_LINK, {
    useNewUrlParser:true
    // useUnifiedTopology:true
})           // previous parameters -> useNewUrlParser : true, useCreateIndex : true, useUnifiedTopology: true;
.then(function(database){
    console.log("Database is Connected with server for Users!");
})
.catch(function(error){
    console.log("Error: ", error);
})

// Moogoose is an async function which provides you a promise on which we use then and catch function. 

// Now we are going to Connect the mongoDB with the application

// UserSchema && userModal

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required: true,
        unique:true,
        validator: function(){
            validator.validate(this.email);
        }
    },
    password:{
        type: String,
        required: true,
        minlength: 5,

    },
    confirmPassword:{
        type: String,
        requried: true,
        validator: function(){
            return this.password == this.confirmPassword;
        }   
    },
    createdAt: Date,
    token: Number,
    role:{
        type: String,
        enum:["admin", "manager", "user"],
        default: "user"
    },
    // review:{
    //     // Contains the array of review
    //     type: [mongoose.Schema.Types.objectId],
    //     ref: "reviewModel"
    // }

})

userSchema.pre('save', function(next){
    // conifrm password will not be saved in DB
    this.ConfirmPassword = undefined;
    next();
})

userSchema.methods.resetHandler = function(password, confirmPassword){
    this.password = password;
    this.confirmPassword = confirmPassword;
    this.token = undefined;
}

const userModel = new mongoose.model('userModel', userSchema); // ref: "userModel" for reviewschema 


// (async function createUserDB(){
//     let user = await userModel.create({
//         name : "Raghav",
//         age: 27,
//         email: "raghavJuneja@gmail.com",
//         password: "abcdef",
//         confirmPassword: "abcdef",
//     });
//     console.log("User created: ", user);
// })();

module.exports = userModel;