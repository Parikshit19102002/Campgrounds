const Review=require('../models/review');
const campModel=require('../models/campground');

module.exports.createReview=async (req,res,next)=>{
    const camp=await campModel.findById(req.params.id);
    const revie=new Review(req.body.review);
    camp.reviews.push(revie);
    revie.owner=req.user._id;
    await camp.save();
    await revie.save();
    req.flash('success','Successfully Added a review!!!!!!');
    res.redirect(`/campground/${req.params.id}`);
};

module.exports.deleteReview=async (req,res,next)=>{
    const {id,reviewId}=req.params;
    await campModel.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId); 
    req.flash('success','Successfully Delete a review!!!!!!');
    res.redirect(`/campground/${id}`);
  };