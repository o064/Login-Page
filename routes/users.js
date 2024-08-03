const express = require("express");
const router = express.Router();
const User = require("../model/users");
const bcrypt = require("bcryptjs");
const passport =require("passport");
router.get("/login", (req, res) => {
    res.render("login");
});
router.get("/register", (req, res) => {
    res.render("register");
});
// register handling
router.post("/register", (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];
    if (!name || !email || !password || !password2) {
        errors.push({ msg: "Please enter all fields" });
    }
    if (password !== password2) {
        errors.push({ msg: "password doesn't match'" });
    }
    if (password < 6) {
        errors.push({ msg: "password must be 6 or more character" });
    }
    if (errors.length > 0) {
        res.render("register", {
            errors,
            name,
            email,
            password,
            password2,
        });
    } else {
        User.findOne({ email: email }).then((user) => {
            if (user) {
                errors.push({ msg: "Email or Password is Wrong" });
                res.render("register", {
                    errors,
                    name,
                    email,
                    password,
                    password2,
                });
            } else {
                const newUser = new User({
                    name,
                    email,
                    password,
                });
                //hash Password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then((user) => {
                                req.flash("success_msg","You are registered and can log In")
                                res.redirect("/users/login");
                            })
                            .catch((err) => console.log(err));
                    });
                });
            }
        });
    }
});

// login handle
router.post("/login",(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect : "/dashboard",
        failureRedirect : "/users/login",
        failureFlash: true
    })(req,res,next);
});
//logout Handle
router.get("/logout", (req,res)=>{
    req.logout((err)=> {
        if (err)  {
            return next(err); 
        }
        req.flash('success_msg', "You are logged out");
        res.redirect("/users/login");
      });

})
module.exports = router;
