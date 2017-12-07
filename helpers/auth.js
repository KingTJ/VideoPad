module.exports = {
    ensureAuthenticated: function(req, res, next) {
        // isAuthenticated is not defined because it is part of the Passport Middleware 
        if(req.isAuthenticated()){
            return next();        
        }
        req.flash('msg_error', 'Not Authorized'); 
        res.redirect('/users/login'); 
    }
}