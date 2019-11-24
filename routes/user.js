const express = require('express')
const passport = require('passport')
const User = require('../model/User')

const router = express.Router();

const UserModel = new User()

router.get('/register', (req, res) => {
    if(req.isAuthenticated()){
        res.redirect('/dashboard')
    }else{
        res.render("register")
    }
})

router.get('/login', (req, res) => {
    if(req.isAuthenticated()){
        res.redirect('/dashboard')   
    }else{
        res.render("login")
    }
})

router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success_msg', 'You are successfully logged out')
    res.redirect('/user/login')
})

router.post('/register', (req, res)=>{
    const {email, password, confirmPassword, name, mobileNumber, role } = req.body;
    let errors = [];

    // Error Handling
    if(!password || !name || !role){ errors.push({msg: 'Please fill in all fields'}) }
    if(password !=  confirmPassword){ errors.push({msg: 'Passwords do not match'}) }
    if(password.length < 6){ errors.push({msg: 'Password should be at least 6 characters'}) }

    if(errors.length > 0){
        res.render('register', {errors, password, confirmPassword, name, email, mobileNumber, role })
    }else{
        UserModel.find(email, (err, user) => {
            if(err){
                errors.push({msg: 'Error: ' + err})
                res.render('register', { errors, password, confirmPassword, name, email, mobileNumber, role })
            }else if(user){
                errors.push({msg: 'Email is alread registerd'});
                res.render('register', { errors, password, confirmPassword, name, email, mobileNumber, role })
            }else{
                UserModel.create({ email, password, name, mobileNumber, role }, (err, result) => {
                    if(result){
                        req.flash('success_msg', 'You are now registered and can log in')
                        res.redirect("/user/login")
                    }else{
                        errors.push({msg: 'Error: ' + err})
                        res.render('register', { errors, password, confirmPassword, name, email, mobileNumber, role })
                    }
                })
            }
        })
    }
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next)
})

router.get('/list', (req, res)=>{
    
    UserModel.find((err, docs) => {
        if(!err){
            console.log(docs)
            res.render("userlist", {data: docs})
            // res.send("User Controller")
        }else{
            res.send("error: " + err)
        }
    })
})

module.exports = router