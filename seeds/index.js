const mongoose=require('mongoose');
const campModel=require('../models/campground');
const city=require('./cities');
const {descriptors,places}=require('./seedsHelper');

mongoose.connect('mongodb://127.0.0.1:27017/myCamp')
.then(()=>{
   console.log("connection established!!!");
})
.catch(()=>{
   console.log("some error occcur in connection!!!");
});

const sample=array=>array[Math.floor(Math.random()*array.length)];

const seedDB=async ()=>{

  await campModel.deleteMany({});

  for(let i=0;i<300;i++){
    
    const n=Math.floor(Math.random()*1000);

    const camp=new campModel({
        owner:'65a9591cafc2880b9578e8f4',
        title:`${sample(descriptors)} ${sample(places)}`,
        place:`${city[n].city} ${city[n].state}`,
        geometry:{
             type:"Point",
             coordinates:[city[n].longitude,city[n].latitude]
        },
        image:[
          {
            url:'https://images.unsplash.com/photo-1482858683229-74280d78908b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODQzNTF8fHx8fHx8MTcwNDkwODE1Nw&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
            filename:'yelpcamp'
          },
          {
            url:'https://www.pixelstalk.net/wp-content/uploads/2016/07/Download-Free-Pictures-3840x2160.jpg',
            filename:'yelpcamp'
          }
        ]
    });

    await camp.save();
    
  }
};

seedDB();

