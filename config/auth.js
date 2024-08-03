module.exports = {
    ensuerAthenticated : function(req,res,next){
        if(req.isAuthenticated())
            return next();
        req.flash("error_msg", "please login first");
        res.redirect("/users/login");
    },
    forwardAuthenticated: function(req, res, next) {
        if (!req.isAuthenticated()) {
          return next();
        }
        res.redirect('/dashboard');      
      }
}