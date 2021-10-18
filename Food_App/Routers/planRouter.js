const planModel = require("../models/plansModel");
const express = require('express');
const { Mongoose } = require("mongoose");

// Router created with express
const planRouter = express.Router();

planRouter.route('/:id')
    .get(getPlanById)
    .patch(updatePlan)
    .delete(deletePlan)

planRouter.route("/")
    .post(createPlan)
    .get(getPlans)


// functions 

// Display All the plans 
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

// create Plan
async function createPlan(request, response){
    try{
        let plan = request.body;
        if(plan){
            plan = await planModel.create(plan);
            response.status(200).json({
                message: "Plan Created successfully"
            })
        }else{
            console.log(error);
            response.status(204).json({
                message:"Plan not created"
            })
        }
    }catch(error){
        console.log(error);
        response.status(500).json({
            message: "Error occured",
            error: error.message
        })
    }
}

// Display particular plan
async function getPlanById(request, response){
    try{
        let id = request.params.id;
        // console.log(name);
        let plan = await planModel.findOne({_id: id});
        response.status(200).json({
            message: "Plan found",
            plan: plan
        })
    }catch(error){
        response.status(500).json({
            messag: "plan Not found",
            error: error.message
        })
    }
}

// Update particular plan
async function updatePlan(request, response){
    try{
        let id = request.params.id;
        if(id){
            let plan = request.body;
            let updatedPlan = await planModel.findByIdAndUpdate(id, plan);
            console.log(updatedPlan);
            response.status(200).json({
                message: "Plan updated",
                plan: updatedPlan
            }) 
        }
    }catch(error){
        response.status(500).json({
            message: "Server error",
            error: error.message
        })
    }
}

// delete Particular plan
async function deletePlan(request, response){
    try{
        let id = request.params.id;
        let deletedPlan = await planModel.findByIdAndDelete(id);
        response.status(204).json({
            message: "Plan deleted",
            plan: deletedPlan
        })

    }catch(error){
        response.status(500).json({
        message: "Server error",
        error: error.message
        })
    }
}

module.exports = planRouter;