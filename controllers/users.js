
const User = require('../models/user');
const {welcome,send}=require("../mail.js")
module.exports.renderSignupForm=(req,res)=>
{
        res.render("users/signup.ejs");
};

module.exports.signup=async(req,res,next)=>
    {
        try{
            let {username,email,password}=req.body;
        const newUser = new User({email,username});
        const registeredUser=await User.register(newUser,password);
        req.login(registeredUser,((err)=>
        {
            if(err){
                return next(err);
            }
           let text = welcome(username);
           let subject = `Welcome to SwapHub, ${username}!`;
           try{
            send(email,subject,text);
           }
           catch(e)
           {
            console.log("email not sent");
           }
            req.flash("success","welcome to SwapHub");
            res.redirect("/listings");
        })) 
        }
        catch(e)
        {
            req.flash("error",e.message);
            res.redirect("/signup");
        }
    };

module.exports.renderLoginForm=(req,res)=>
    {
        res.render("users/login.ejs");
    };    
 
    

module.exports.login=async(req,res)=>
    {
        req.flash("success","welcome to SwapHub");
        // console.log(res.locals.redirectUrl)
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    };
    
 
 module.exports.logout =(req,res,next)=>
    {
        req.logout((err)=>
        {
            if(err)
            {
               return  next(err);
            }
            req.flash("success","you are logged out");
            res.redirect("/listings");
        })
    };