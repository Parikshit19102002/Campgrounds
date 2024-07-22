const mongoose=require('mongoose');
const Review=require('./review');

const opt={ toJSON: { virtuals:true } }

const schema=new mongoose.Schema({
  title: String,
  place: String,
  image:[
    {
      url:String,
      signature:String
    }
  ],
  geometry: {
        type:{
           type: String,
           enum: ['Point'],
           required: true
        },
        coordinates:{
           type: [Number],
           required: true
        }
  },
  price: Number,
  description: String,
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  reviews: [{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Review'
  }]
},opt);

schema.virtual('properties.popUpMarkup').get(function(){
   return `
   <strong><a href="campground/${this._id}">${this.title}</a><strong>
   <p>${this.description}.....</p>`
})

schema.post('findOneAndDelete',async (doc)=>{
   await Review.deleteMany({_id:{$in:doc.reviews}});
})

module.exports=new mongoose.model('CampModel',schema);

