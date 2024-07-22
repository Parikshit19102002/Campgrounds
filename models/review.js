const mongoose=require('mongoose');

const review=new mongoose.Schema({
  body:String,
  ratting:Number,
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  }
});

module.exports=new mongoose.model('Review',review);
