const reviewModel = require('../models/reviewModel');
const planModel = require('../models/plansModel');
const express = require("express");

const reviewRouter = express.Router();
const routeHelper = require('./routeHelper');
const factory = require('../helpers/factory');
const { response } = require('express');

const protectRoute = routeHelper.protectRoute;

const getReviews = factory.getElements("reviews", reviewModel);

// create review cannot be created with factory method 
const createReviews = async function(request,response){
    try{
        let review = await reviewModel.create(request.body);
        console.log(review);
        let planId = review.plan;
        let plan = await planModel.findByIdAndUpdate(planId);
        // averageRating
        if(plan.averageRating){
            let sum = plan.averageRating * plan.reviews.length;
            let totalNumReviews = plan.reviews.length+1;
            let finalAvgRating = (sum + review.rating)/ totalNumReviews;
            plan.averageRating= finalAvgRating;
        }else{
            plan.averageRating = review.rating;
        }
        plan.reviews.push(review["_id"]);
        await plan.save();
        response.status(200).json({
            message: "Review Created successfully",
            review : review
        })
        
    }catch(error){
        console.log(error);
        response.status(500).json({
            message: "error occured",
            error : error.message
        })
    }
}

const getReviewsById = factory.getElementById("reviews", reviewModel);
const updateReviews = factory.updateElement("reviews", reviewModel);

// delete review function cannot work from factory function
const deleteReviews = async function(request,response){

    try{ 
        // review model -> ddelete review function
        let review = await reviewModel.findByIdAndDelete(request.body.id);

        // planModel array -> delete review 
        let planId = review.planId;
        let plan = await planModel.findById(planId);
        let idxOfReview = plan.review.indexOf(review["_id"]);
        plan.review.splice(idxOfReview, 1);
        await plan.save();
        response.status(200).json({
            message: "Review deleted successfully",
            deletedReview : review
        })
    }catch(error){
        console.log("Error" + error.message);
        response.status(500).json({
            message: "Problem in delete request",
            error: error.message
        })
    }
   
   
}

reviewRouter.use(protectRoute);

reviewRouter.route('/')
    .get(getReviews)
    .post(createReviews)

reviewRouter.route('/:id')
    .get(getReviewsById)
    .patch(updateReviews)
    .delete(deleteReviews)

module.exports = reviewRouter;