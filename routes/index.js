const express = require("express");
const router = express.Router();
const {ensuerAthenticated,forwardAuthenticated}=require("../config/auth.js");

router.get("/", forwardAuthenticated,(req,res) =>{
    res.render("welcome");
});
router.get("/dashboard", ensuerAthenticated,(req,res) =>{
    res.render("dashboard", { user :req.user});
});
module.exports = router;
