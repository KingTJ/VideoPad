const express = require('express'); 
const mongoose = require('mongoose'); 
const bcrypt = require('bcryptjs'); 
const passport = require('passport'); 
const router = express.Router(); 

// Load User Model
require('../models/User'); 
const User = mongoose.model('users');  

// User Login Route
router.get('/login', (req, res) => {
    res.render('users/login'); 
}); 

// User Register Route
router.get('/register', (req, res) => {
    res.render('users/register'); 
}); 

// Login Form POST
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next); 
});

// Register Form POST
router.post('/register', (req, res) => {
    let errors = []; 
    
    if(req.body.password != req.body.password2){
        errors.push({text:'Passwords do not match'})
    }
    
    if(req.body.password.length < 4){
        errors.push({text:'Password must be at least 4 characters'})   
    }
    
    if(errors.length > 0){
        res.render('users/register', {
            // We pass these in so the form doesn't have to clear when its wrong. User won't have to re-enter everything
            errors: errors,
            name: req.body.name,
            password: req.body.password,
            password2: req.body.password2
        }); 
    } else {
        User.findOne({email: req.body.email})
            .then(user => {
                if(user){
                    req.flash('msg_error', 'Email already registered');
                    res.redirect('/users/register'); 
                } else{
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    });
                    
                    // Encrypt password using bcrypt function. Password will be hashed
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err) throw err; 
                            newUser.password = hash; 
                            newUser.save() 
                                .then(user => {
                                    req.flash('msg_success', 'You are now registered and can log in!'); 
                                    res.redirect('/users/login');  
                                })
                                // Just in case we have any errors
                                .catch(err => {
                                    console.log(err); 
                                    return; 
                                });
                        });          
                    });  
                  }
            });     
    }
}); 

// Logout User
router.get('/logout', (req, res) => {
    req.logout(); 
    req.flash('msg_success', 'You have successfully logged out!'); 
    res.redirect('/users/login'); 
}); 

module.exports = router; 
