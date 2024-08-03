const express =require('express');
const expressLayouts = require("express-ejs-layouts");
const app = express();
const mongoose = require("mongoose");
const User = require("./model/users");
const session =require("express-session");
const flash =require("connect-flash");
const passport  =require("passport");
// confing passport

require("./config/passport")(passport);
//connect db
const db = require("./config/keys").mongoURI;
const PORT = process.env.port ||3000;
mongoose.connect(db)
        .then(()=>{
            console.log("mongobd connected")
            app.listen(PORT,()=> {
                console.log("server is listening");
            })
        }).catch(err =>console.log(err));
//ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');
//bodyparser
//This middleware is commonly used when you expect to receive form data submitted via HTTP POST or PUT requests.
// The parsed data will be available in req.body.

app.use(express.urlencoded({extended :false}));

// express session
app.use(session({
    secret: 'secure',
    resave: true,
    saveUninitialized: true

}));
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// connect flash
app.use(flash());
//Global variables
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");

    next();


});


//routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));


