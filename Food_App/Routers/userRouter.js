const userModel = require('../models/userModel');
const express = require('express');

const userRouter = express.Router();
const protectRoute = require('./routeHelper');

userRouter.route('/')
    // .get(protectRoute, getUsers)
    .get(getUsers)

userRouter.route('/:id')
    .get(getUserById)
    .patch(updateUser)
    .delete(protectRoute, authorizedUser(["admin"]), deleteUser)

// functions

// getUser
async function getUsers(request, response){ 
    try{
        let users = await userModel.find();
        response.status(200).json({
            "message": "The details of All the users",
            users: users
        })
    }
    catch(error){
        console.log(error.message)
        response.status(500).json({
            "message": "No users found",
            error: error.message
        })
    }
}
// UpdateUser
async function updateUser(request, response){
    try{
        let obj = request.body;
        let id = request.params.id;
        let user = await userModel.findByIdAndUpdate(id)
        console.log("user updated", obj);
        response.status(401).json({
            message: "User Updated",
            user: {
                "_id": request.params,
                "name": obj.name,
                "age": obj.age,
                "email": obj.email,
                "password": obj.password,
                "confirmPassword": obj.confirmPassword,
                "_v": user._v
            }
            })
    }catch(error){
        response.status(500).json({
            "message": "No users found",
            error: error.message
        })
    }
}
// deleteUser
async function deleteUser(request, response){
    try{
        // if user exist
        let id = request.params.id;
        let user = await userModel.findByIdAndDelete(id);
        response.status(401).json({
            message: "The Mentioned User Deleted",
            user: user
        })

    } catch(error){
        response.status(500).json({
            message: "No user found"
        })
    }
}
// GetUserById
async function getUserById(request, response){
    try{    
        let id = request.params.id;
        let user = await userModel.findById(id);
        response.status(200).send({
            "message": "User FOUND",
            _id: user._id
            
        });

    }    catch(error){
        response.status(500).json({
            "message": "No users found",
            error: error.message
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

module.exports = userRouter;