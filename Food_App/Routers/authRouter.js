const userModel = require('../models/userModel');
const express = require('express');
const jwt = require('jsonwebtoken');
const { JWT_Key} = require('../secrets');

const authRouter = express.Router();

let emailSender = require("../externals/emailSender")

authRouter
    .post('/signUp', setCreatedAt, signUpUser)
    .post('/login', loginUser)
    .post('/forgetPassword', forgetPassword)
    .post('/resetPassword', resetPassword)

// Functions 
// Time while create the user, admin, manager
function setCreatedAt(request, response, next){
    let body = request.body;
    // check that the body is empty or not
    let length = Object.keys(body).length;
    if(length==0){
        response.status(400).json({
            message: "No Details entered"
        })
    }
    request.body.createdAt = new Date().toISOString();
    console.log(request.body.createdAt);
    next();

}

// sign up page
async function signUpUser(request, response){
    // email, Name, Password
    try{
        let userObj = request.body;
        let user = await userModel.create(userObj);
        console.log("user", user);
        response.status(200).json({
            message:"User Created",
            createdUser: user
        })
    }
    catch(error){
        response.status(500).json({
            message: error.message
        })
    }
}

// login 
async function loginUser(request, response){
    // email?? // password??
    try{
        if(request.body.email && request.body.password){
            let user = await userModel.findOne({
                'email': request.body.email,
            })
            if(user){
                if(user.password == request.body.password){
                    // token created
                    // -> header -> algorithm ,payload = id, private key-> only server got it
                    let payload = user["_id"];
                    let token=
                    jwt.sign({ id: payload }, JWT_Key);
                
                    // header set
                    response.cookie("jwt", token, {httpOnly: true});
                    console.log("cookie sent");
                    response.status(200).json({
                        "message": "Login successfully",
                        user : user.name
                    })
                } else{
                    response.status(403).json({
                        "message": "Incorrect email or password"
                    })
                }
            } else{
                response.status(401).json({
                    "message": "Please enter the required details"
                })
                
            }
        }
    }
        catch(error){
            response.status(500).json({
                message: error.message
            })
        }
    }
    
// forget password
async function forgetPassword(request,response){
    // Email 
    let email = request.body.email;
    var otp = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
    // console.log(otp);
    try{
        if(email){

            await userModel.updateOne({email}, { token:otp });
            let user = await userModel.findOne({email});
            await emailSender(otp, email);
            console.log("user", user);

            if(user?.token){
                console.log("User: " + "'"+user.name +"'"+ " got otp: " + user.token);
                response.status(200).json({
                    message: "User: " + "'"+user.name +"'"+ " got otp: " + user.token
                })
            }else{
                response.status(400).json({
                    message: "Not valid otp"
                })
            }
        }else{
            response.status(400).json({
                message:"Email is required"
            })
        }
    }catch(error){
        response.status(400).json({
            message: error.message + " Try error"
        })
    }         
            
}
   

// reset password
async function resetPassword(request,  response){
    // 3 requirements -> password, confirmPassword, otp
    let {password, confirmPassword, token} = request.body;
    try{
        if(token){
            let user =await userModel.findOne({ token });
            if(user){
                user.resetHandler(password, confirmPassword);
                console.log(user);
                await user.save();
                console.log("Password Reset Successfully")
                return response.status(200).json({
                    message: " Password Reset Succesfully"
                })

            }else{
                 response.status(400).json({
                    message : "User not exists or wrong otp"
                })
            }
        }else{
            response.status(400).json({
                message: "Otp is required"
            })
        }
    }catch(error){
        return response.status(404).json({
            message: "error:" + error.message
        })
    }
}

module.exports = authRouter;