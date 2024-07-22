const express=require('express');
const router=express.Router();
const User=require('../models/user');
const passport=require('passport');
const {isAuthor} =require('../middleWare');
const {storeReturnTo} =require('../middleWare');
const user=require('../controller/user');
const review = require('../models/review');

router.get('/register',user.registerFormrender);

router.post('/register',user.register);

router.get('/login',user.loginFormrender);

router.post('/login',storeReturnTo,passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),user.login);

router.get('/logout',user.logout);
 
module.exports=router;