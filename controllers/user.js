const User = require("../models/user.js");

module.exports.getrouter=(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.postrouter=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new User({username,email});
        const registerUser=await User.register(newUser,password);
        console.log(registerUser);
        req.login(registerUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","User was register successfully");
            res.redirect("/listings");
        });
    }catch(e){
        req.flash("error","User of username or email register.");
        res.redirect("/signup");
    };
    
};

module.exports.loginget=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.loginpost=async(req,res)=>{
    req.flash("success", "Welcome back!");
    let redirectUrl =res.locals.redirectUrl ||"/listings";
    res.redirect(redirectUrl);
};

module.exports.loggout=(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","logged you out!");
        res.redirect("/listings");
    });
};