const User=require('../models/user');

module.exports.registerFormrender=(req,res)=>{
    res.render('user/register');
};

module.exports.register=async(req,res,next)=>{
    try{
      const {email,username,password}=req.body;
      const user=new User({email,username});
      const h=await User.register(user,req.body.password);
      req.login(h,(err)=>{
         if(err) return next(err);
 
         req.flash('success',"Sucessfully Register!!!!");
         res.redirect('/campground');
      })
     
    }
    catch(e){
       req.flash('error',e.message);
       res.redirect('/register');
    }
 };

 module.exports.loginFormrender=(req,res)=>{
    res.render('user/login');
};


 module.exports.login=(req,res,next)=>{

    req.flash('success',"Successfully Login!!!!!");
    const url=res.locals.returnTo || '/campground';
    delete req.session.returnTo;
    res.redirect(url);
};

module.exports.logout=(req, res) => {

    req.logout((err) => {
      if (err) {
        
        console.error(err);
        return res.redirect('/');
      }
     
      req.flash('success', 'Successfully Logout!!!');
      res.redirect('/login');
    });
  };