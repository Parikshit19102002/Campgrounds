const express=require('express');
const router=express.Router();
const catchAsync=require('../Error/catchAsync');
const ExpressError=require('../Error/ExpressError');
const Joi=require('joi');
const campModel=require('../models/campground');
const passport=require('passport');
const { isLoggedIn,isAuthor } = require('../middleWare');
const campground=require('../controller/campground');
const multer = require('multer');


const map=require('@mapbox/mapbox-sdk/services/geocoding')
const token=process.env.MAPBOX_TOKEN;
const geocoder=map({accessToken : token});

const cloudinary = require("cloudinary").v2;
require("dotenv").config();


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const campgroundSchema=Joi.object({

  campground:Joi.object({
    title:Joi.string().required(),
    place:Joi.string().required(),
    price:Joi.number().min(0).required(),
    description:Joi.string()
}).required(),
deleteImages:Joi.array()
})

  const checkValidation=function(req,res,next){
  const {error}=campgroundSchema.validate(req.body.campground);
  if(error){
    const message=error.details.map(er=>er.message).join(',');
    throw new ExpressError(message,400);
  }
  else{
    next();
  }
}

router.get('/',catchAsync(campground.index));
  
router.get('/new',isLoggedIn,campground.newcampFormrender);
  
router.get('/:id',catchAsync(campground.showCampground));
  

router.post('/',upload.array('image'),async (req,res)=>{
 
  const geoData=await geocoder.forwardGeocode({
    query: req.body.campground.place,
    limit: 1
  })
  .send()
  
  console.log(geoData.body.features[0].geometry);

  //res.send("hellow");

 const imgUrl=[];

  for(let file of req.files){

    const result = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${file.buffer
        .toString("base64")
       .replace(/(\r\n|\n|\r)/gm, "")}`
    );
    imgUrl.push(result);
  }
  
    const camp=new campModel(req.body.campground);
    camp.geometry=geoData.body.features[0].geometry;
    camp.image=imgUrl.map(f=>({url:f.url,signature:f.signature}));
    camp.owner=req.user._id;
    camp.save();
    req.flash('success','Successfully Added new Campground!!!!!!');
    res.redirect(`/campground/${camp._id}`);
})
  
router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campground.editFormrender));


router.put('/:id',isLoggedIn,upload.array('image'),catchAsync(async (req,res)=>{
  
  console.log(req.body);
  // res.send("hellow")
  const imgUrl=[];

  for(let file of req.files){

    const result = await cloudinary.uploader.upload(
     `data:image/jpeg;base64,${file.buffer
       .toString("base64")
       .replace(/(\r\n|\n|\r)/gm, "")}`
    );
    imgUrl.push(result);
  }

  const imgs=imgUrl.map(f=>({url:f.url,signature:f.signature}));
  const camp= await campModel.findByIdAndUpdate(req.params.id,req.body.campground);
   camp.image.push(...imgs);
   await camp.save();
   
    if(req.body.deleteImages){

    for(let sig of req.body.deleteImages){
    await cloudinary.uploader.destroy(sig)
    }
    
    await camp.updateOne({$pull:{image:{signature:{$in:req.body.deleteImages}}}})
    await camp.save()
   }


   req.flash('success','Successfully Edit Campground!!!!!!');
   res.redirect(`/campground/${camp._id}`);

  }));
  

router.delete('/:id',isAuthor,catchAsync (campground.delete));


router.use((err,req,res,next)=>{
    const {message="something went wrong",status=404}=err;
    res.status(status).render('campground/error',{message});
 });


 module.exports=router;
 