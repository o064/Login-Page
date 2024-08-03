const localstratgy = require("passport-local").Strategy;
const mongoose =require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../model/users");

module.exports = function(passport){
    passport.use(
        new localstratgy({usernameField : "email"}, (email,password,done)=>{
            User.findOne({email : email})
                .then(user => {
                    // match email
                    if(!user){
                        return done(null,false ,{message : "Email or password is wrong"} );
                    }
                    // match password
                    bcrypt.compare(password,user.password , (err, isMatch)=>{
                        if(err) throw err;
                        if(isMatch){
                            return done(null,user);
                        }else{
                            return done(null,false ,{message : "Email or password is wrong"} );
                        }
                    });
                }).catch(err => console.log(err));
                passport.serializeUser(function(user, done) {
                    done(null, user.id);
                });
                
                passport.deserializeUser(async function(id, done) {
                    try {
                        const user = await User.findById(id);
                        done(null, user);
                    } catch (err) {
                        done(err, null);
                    }
                });
                
        })
    )

}