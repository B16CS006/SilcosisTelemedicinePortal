module.exports = {
    ensureAuthenticated: function(req, res, next){
        if(req.isAuthenticated()){
            return next()
        }
        req.flash('error_msg', 'Access Denied, Please do login first')
        res.redirect('/user/login')
    }
}   