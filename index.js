if (process.env.NODE_ENV !== "production") {
   require('dotenv').config();
}

const express=require('express');
const app=express();
const path=require('path');
const mongoose=require('mongoose');
const campModel=require('./models/campground');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const catchAsync=require('./Error/catchAsync');
const ExpressError=require('./Error/ExpressError');
const Joi=require('joi');
const Review=require('./models/review');
const campgrounds = require('./routes/campground');
const reviewss = require('./routes/review');
const session=require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User = require('./models/user');
const userRouter=require('./routes/user');

//const session = require('express-session');
const MongoStore=require('connect-mongo')

//const dburl=process.env.DB_URL;
const dburl='mongodb://127.0.0.1:27017/myCamp'

mongoose.connect(dburl)
.then(()=>{
   console.log("connection established!!!");
})
.catch(()=>{
   console.log("some error occcur in connection!!!");
});



app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static('public'));

const store = MongoStore.create({
   mongoUrl: dburl,
   touchAfter: 24 * 60 * 60,
   crypto: {
       secret: 'thisshouldbeabettersecret!'
   }
});

store.on("error",function(e){
   console.log("Session Store Error!!!!",e)
})


app.use(session({store,name:'session',secret:'hellow',resave:false,saveUninitialized:true,
cookie:{
   httpOnly:true,
   expires:Date.now()+7*24*60*60*1000,
   maxAge:7*24*60*60*1000
}}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
   res.locals.success=req.flash('success');
   res.locals.error=req.flash('error');
   res.locals.currentUser=req.user;
   next();
});

app.use('/campground',campgrounds);
app.use('/campground/:id/review',reviewss);
app.use('/',userRouter);



app.get('/',(req,res)=>{
   res.render('campground/home.ejs');
});


 app.use((err,req,res,next)=>{
    const {message="something went wrong",status=404}=err;
    res.status(status).render('campground/error',{message});
 });

app.listen(4000,()=>{
  console.log("Lisening to Port 4000!!!!!");
});