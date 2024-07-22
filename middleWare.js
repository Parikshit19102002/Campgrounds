const campModel=require('./models/campground');
const Review=require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        console.log(req.originalUrl);
        req.session.returnTo=req.originalUrl;
        req.flash('error', 'You must be Logged in  first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor=async (req,res,next)=>{
  const {id}=req.params;
  const campground=await campModel.findById(id);
  if(!campground.owner.equals(req.user._id)){
    req.flash('error','No Permission!!!');
    return res.redirect('/campground');
  }

  next();
}


module.exports.reviewAuthor=async (req,res,next)=>{
  const {id,reviewId}=req.params;
  const review=await Review.findById(reviewId);
  if(!review.owner.equals(req.user._id)){
    req.flash('error','You Dont have Permission to do that!!!');
    return res.redirect(`/campground/{id}`);
  }

  next();
}

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
      res.locals.returnTo = req.session.returnTo;
  }
  next();
}


  
  