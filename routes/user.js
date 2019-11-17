const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const passport = require('passport')

const router = express.Router();
const User = require('../model/User')

router.get('/register', (req, res) => {
    res.render("register")
})

router.get('/login', (req, res) => {
    res.render("login")
})

router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success_msg', 'You are successfully logged out')
    res.redirect('/user/login')
})


router.post('/register', (req, res)=>{
    const {email, password, confirmPassword, name, phoneNumber, role } = req.body;
    let errors = [];

    // Error Handling
    if(!password || !name || !role){ errors.push({msg: 'Please fill in all fields'}) }
    if(password !=  confirmPassword){ errors.push({msg: 'Passwords do not match'}) }
    if(password.length < 6){ errors.push({msg: 'Password should be at least 6 characters'}) }

    if(errors.length > 0){
        res.render('register', {errors, password, confirmPassword, name, email, phoneNumber, role })
    }else{
        User.findOne({email: email})
            .then(user => {
                if(user){
                    errors.push({msg: 'Email is alread registerd'});
                    res.render('register', { errors, password, confirmPassword, name, email, phoneNumber, role })
                }else{
                    const newUser = new User({ email, password, name, phoneNumber, role, uuid: 12 })
                    console.log(newUser)
                    
                    bcrypt.genSalt(10, (err, salt) => 
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err) throw err;
                            newUser.password = hash;

                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered and can log in')
                                    res.redirect("/user/login")
                                })
                                .catch(err => console.log(err))
                        })
                    )
                }
            })
            .catch(err => {
                errors.push({msg: 'Error: ' + err})
                res.render('register', { errors, password, confirmPassword, name, email, phoneNumber, role })
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
    
    User.find((err, docs) => {
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