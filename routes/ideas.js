const express = require('express'); 
const mongoose = require('mongoose'); 
const router = express.Router(); 
const {ensureAuthenticated} = require('../helpers/auth')

// Load Idea Model. We use two dots here to signify that we have to go up one folder to get to the Idea file. (./) means same folder.
require('../models/Idea');
const Idea = mongoose.model('ideas');

// Idea Index Page
router.get('/', ensureAuthenticated, (req, res) => {
    // Match each idea to their specific user
    Idea.find({user: req.user.id})
        .sort({date:'desc'})
        .then(ideas => {
            res.render('ideas/index', {
                ideas:ideas
            });        
        });
});

// Add Idea Form
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('ideas/add');
});

// Edit Idea Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        if(idea.user != req.user.id){
            req.flash('msg_error', 'Not Authorized'); 
            res.redirect('/ideas');  
        } else{
            res.render('ideas/edit', {
                idea:idea 
        });   
        }      
    }); 
});

// Process Form
router.post('/', ensureAuthenticated, (req, res) => {
    let errors = [];
    
    if(!req.body.title){
        errors.push({text:'Please add a title'}); 
    }
    if(!req.body.details){
        errors.push({text:'Please add some details'}); 
    }
    
    if(errors.length > 0){
        res.render('/add', {
            errors: errors,
            // Pass in the title so whatever they put in the box doesn't dissapear and it stays
            // The form just gets rerendered
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        }
        new Idea(newUser)
            .save()
            .then(idea => {
                req.flash('msg_success', 'Video Idea Added.');
                res.redirect('/ideas');
        })
    }
});

// Edit Form Process
router.put('/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id 
    })
    .then(idea => {
        // new values
        idea.title = req.body.title;
        idea.details = req.body.details;       
        idea.save()
            .then(idea => {
                req.flash('msg_success', 'Video Idea Updated.');
                res.redirect('/ideas');
        })
    });
});

// Delete Idea
router.delete('/:id', ensureAuthenticated, (req, res) => {
    Idea.remove({_id: req.params.id})
        .then(() => {
            req.flash('msg_success', 'Video Idea Removed.'); 
            res.redirect('/ideas');
        });
});

module.exports = router; 