// Route Help
// protect route
const jwt = require('jsonwebtoken');
const {JWT_Key} = require('../secrets');
function protectRoute(request, response, next){
    try{
        let cookieName = request.cookies.jwt;
        console.log(cookieName);
        let decryptedToken = jwt.verify(request.cookies.jwt, JWT_Key);
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

module.exports = protectRoute;