// Server <--> Mongoose <--> MongoDB

const mongoose = require('mongoose');
let { DB_LINK } = require('../secrets');

const validator = require('email-validator');

// connect server to the Mongoose       
                                        // now we dont need this
mongoose.connect(DB_LINK, {})           // previous parameters -> useNewUrlParser : true, useCreateIndex : true, useUnifiedTopology: true;
.then(function(database){
    console.log("Database is Created with user details!");
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
    }   
})

const userModel = new mongoose.model('userModel', userSchema);

(async function createUserDB(){
    let user = await userModel.create({
        name : "Raghav",
        age: 27,
        email: "raghavJuneja@gmail.com",
        password: "abcdef",
        confirmPassword: "abcdef",
    });
    console.log("User created: ", user);
})();