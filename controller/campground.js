const campModel=require('../models/campground');

module.exports.index=async (req,res)=>{
   
    const campground= await campModel.find({});
    res.render('campground/index',{campground});
  };

module.exports.newcampFormrender=(req,res,next)=>{

    res.render('campground/addNew');
  };

module.exports.showCampground=async (req,res)=>{

    const campground= await campModel.findById(req.params.id).populate({
     path:'reviews',
     populate:{
       path:'owner'
     }
    }).populate('owner');

    if(!campground){
     req.flash('error','cannot find the Campgroung');
     return res.redirect('/campground');
    }
    else{
    res.render('campground/show',{campground});
    }
  };

  module.exports.newCamp=(req,res)=>{
    
    const camp=new campModel(req.body.campground);
    
    camp.owner=req.user._id;
    camp.save();
    req.flash('success','Successfully Added new Campground!!!!!!');
    res.redirect(`/campground/${camp._id}`);
 };

 module.exports.editFormrender=async (req,res)=>{
    const campground= await campModel.findById(req.params.id);
    console.log(campground,"hellow")
    if(!campground){ 
     req.flash('error','cannot find the Campgroud');
     return res.redirect('/campground');
    }
    res.render('campground/edit',{campground});
  };

module.exports.edit=async (req,res)=>{

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
    req.flash('success','Successfully Edit Campground!!!!!!');
    res.redirect(`/campground/${camp._id}`);
  };

module.exports.delete=async (req,res)=>{
    const camp= await campModel.findByIdAndDelete(req.params.id);
    req.flash('success','Successfully Deleted Campground!!!!!!');
    res.redirect(`/campground`);
  };