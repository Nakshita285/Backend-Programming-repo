const planModel = require("../models/plansModel");
const express = require('express');
// const { Mongoose } = require("mongoose");
const factory = require("../helpers/factory");
const routeHelper = require("./routeHelper");

const protectRoute = routeHelper.protectRoute;
const authorizedUser = routeHelper.authorizedUser;

// Router created with express
const planRouter = express.Router();

async function getPlans(request, response){     
    // steps for the query params selectors 
    // filter 
    // sort
    // remove
    // paginate 
        try{
            // find all the plans, sort it according to queryField, select from the below basis.
            let ans = JSON.parse(request.query.myquery);
            console.log("Answer: "+ ans);
        let planPromise = planModel.find(ans);
        let sortfield = request.query.sort;
        let sortQueryPromise = planPromise.sort(`-${sortfield}`);
        let parameters = await request.query.select.split("%").join(" ");
        console.log(parameters);
        let filteredQueryPromise  = sortQueryPromise.select(`${parameters}`);
        filteredQueryPromise.select( `-_id`);
        console.log(filteredQueryPromise);
    
        // pagination -> (skip, limit) , 1 page -> 4 objects 
        let page = request.query.page || 1;
        console.log(page);
    
        let limit = request.query.limit || 4;
        console.log(limit);
    
        let toSkip = ( page -1 ) * limit;
        console.log(toSkip);
    
        let paginatedResultPromise = filteredQueryPromise.skip(toSkip).limit(limit);
        let result = await paginatedResultPromise;
        console.log(result);
    
        response.status(200).json({
            message: "Here the plans as follows ",
            plans: result
        })
    
        }catch(error){
            response.status(404).json({
                message: "No plan found with this request",
                error : error.message
            })
        }
    }
    
async function getTop3Plans(request,response){
    try{
        // top 3 plans -> based on ratings -> find their reviews
        let plans = await planModel
            .find().sort("-averageRating").limit(4)
            .populate({
                path: 'reviews',
                select:`review rating -${"_id"}`
            })
// populate function-> let use reference objects of different models 
// plan model -> reviews model ko refer karna 
        console.log(plans);
        response.status(200).json({
            plans: plans
        })
    }catch(error){
        console.log(error);
        response.status(404).json({
            message:"Error in request",
            error: error.message
        })
    }
}
    // factory -> require create plan function

    // functions 

// Display All the plans 
    const createPlan = factory.createElement("plan",planModel);
    const getPlanById = factory.getElementById("plan",planModel);
    const updatePlan = factory.updateElement("plan",planModel);
    const deletePlan = factory.deleteElement("plan",planModel);


planRouter.route('/top3Plans')
    .get(getTop3Plans)    
planRouter.route('/:id')
    .get(protectRoute,getPlanById)
    .patch(protectRoute,updatePlan)
    .delete(protectRoute,deletePlan)

planRouter.route("/")
    .get(protectRoute, getPlans)
    .post(protectRoute, createPlan)

module.exports = planRouter;