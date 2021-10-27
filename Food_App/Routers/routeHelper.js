// Route Help
// protect route
const jwt = require('jsonwebtoken');
const {JWT_Key} = require('../secrets');
const userModel = require("../models/userModel");

function protectRoute(request, response, next){
    try{
        let cookieName = request.cookies.jwt;
        // console.log(cookieName);
        let decryptedToken = jwt.verify(cookieName, JWT_Key);
        if(decryptedToken){
            // console.log(isVerified.id);
            request.id = decryptedToken.id;    // here we are going to add Jwt 
            console.log("Flag is checked");
            next();
            
        }else{
            response.status(400).json({
                message: "you are not allowed"
            })
        }
    }catch(error){
        response.status(500).json({
            message: "server Error " +error.message
        })
    }
}

// authorized function
function authorizedUser(roleArr){
    return async function (request, response, next){
        let uid = request.id;
        
        let {role}= await userModel.findById(uid);
        let isAuthorized = roleArr.includes(role);
        if(isAuthorized){
            console.log("Authorized");
            next();

        }else{
            response.status(401).json({
                message:"User not authorized. Contact Admin"
            })
        }
    }
}

module.exports.protectRoute = protectRoute;
module.exports.authorizedUser = authorizedUser;