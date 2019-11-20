const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// Load User Model
const User = require('../model/User')
const UserModel = new User()

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email'}, (email, password, done) => {
            // Is there a user with email
            UserModel.find(email, (err, user) => {
                if(user){
                    // Check the password encrypted
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if(err) throw err;
                        if(isMatch){
                            return done(null, user)
                        }else{
                            return done(null, false, {message: 'Incorrect password'})
                        }
                    })
                }else{
                    return done(null, false, {message: 'That email is not registered'})
                }
            })
        })
    )

    passport.serializeUser((user, done) => {
        done(null, user.userID);
    });
    
    passport.deserializeUser((id, done) => {
        UserModel.findById(id, (err, user) => {
            done(err, user);
        });
    });
}