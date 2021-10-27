const userModel = require('../models/userModel');
const express = require('express');

const userRouter = express.Router();
// const protectRoute = require('./routeHelper');
const routeHelper = require('../Routers/routeHelper');
const factory = require('../helpers/factory');

const protectRoute = routeHelper.protectRoute;
const authorizedUser = routeHelper.authorizedUser;

// functions 
const getUsers = factory.getElements("user", userModel);
const createUser = factory.createElement("user", userModel);
const updatedUser =factory.updateElement("user", userModel);
const deleteUser = factory.deleteElement("user", userModel);
const getUserById = factory.getElementById("user", userModel);

userRouter.route('/')
    // .get(protectRoute, getUsers)
    .get(protectRoute, authorizedUser(["admin"]), getUsers) 
    .post(protectRoute, authorizedUser(["admin"]), createUser)

userRouter.route('/:id')
    .get(protectRoute,  authorizedUser(["admin"]), getUserById)
    .patch(protectRoute, authorizedUser(["admin", "manager"]), updatedUser)
    .delete(protectRoute, authorizedUser(["admin"]), deleteUser)

module.exports = userRouter;