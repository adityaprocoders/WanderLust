const User = require("../models/user");


module.exports.signupForm =  (req,res)=>{
    res.render("./users/signup.ejs");
};

module.exports.signup = async(req,res)=>{
    try{
     let {username, email, password} = req.body;
     const newUser = new User({email, username});
     const rgisterUser = await User.register(newUser, password);
     req.login(rgisterUser, (err)=>{
         if(err){
             return next(err);
         }
          req.flash("success", "Welcome to WandeerLust");
     res.redirect("/listings");
     })
    }catch(e){
     req.flash("error", e.message);
     res.redirect("/signup");
    }
 };


module.exports.loginForm = (req,res)=>{
    res.render("./users/login.ejs");
};

module.exports.login = async(req,res)=>{
    req.flash("success", "Welcome back to WanderLust");
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = async(req,res,next)=>{
    req.logout((err)=>{
        if(err){
         return next(err);
        }
        req.flash("success", "you are Logout!");
        res.redirect("/listings");
    });
};