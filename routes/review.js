const express=require('express');
const router=express.Router({mergeParams:true});
const Joi=require('joi');
const Review=require('../models/review');
const campModel=require('../models/campground');
const catchAsync=require('../Error/catchAsync');
const ExpressError=require('../Error/ExpressError');
const {isLoggedIn,reviewAuthor}=require('../middleWare');
const review=require('../controller/review');

function reviewCheck(req,res,next){

    const checkReview=Joi.object({
      body:Joi.string().required(),
      ratting:Joi.number()
  }).required();
  
    const {error}=checkReview.validate(req.body.review);
  
  
  if(error){
     const message=error.details.map(er=>er.message).join(',');
     throw new ExpressError(message,400);
  }
  else{
    next();
  }
  }
  
   router.post('/',isLoggedIn,reviewCheck,catchAsync(review.createReview));
  
  
   router.delete('/:reviewId',isLoggedIn,reviewAuthor,catchAsync(review.deleteReview));
  
  
   router.use((err,req,res,next)=>{
      const {message="something went wrong",status=404}=err;
      res.status(status).render('campground/error',{message});
   });

   module.exports=router;