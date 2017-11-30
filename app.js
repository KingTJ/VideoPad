// Used to bring in Express
const express = require('express'); 
const exphbs  = require('express-handlebars');
const methodOverride = require('method-override');
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose'); 

// Initialize Application
const app = express(); 

// Map Global Promise - get rid of warning
mongoose.Promise = global.Promise; 

// Connect to Mongoose
mongoose.connect('mongodb://localhost/VideoPad-dev', {
    useMongoClient: true
})
// The then statement catches the promise after connecting to the database
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// Load Idea Model
require('./models/Idea');
const Idea = mongoose.model('ideas');

// HandleBars Middleware
// I'm telling system that we want to use the HandleBars template engine
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Method Override Middleware
app.use(methodOverride('_method')); 

// Index Route
app.get('/', (req, res) => {
    const title = 'Keep up with your ideas!'; 
    res.render('index', {
        title: title
    });
}); 

// About Route
app.get('/about', (req, res) => {
    res.render('about');
});

// Idea Index Page
app.get('/ideas', (req, res) => {
    Idea.find({})
        .sort({date:'desc'})
        .then(ideas => {
            res.render('ideas/index', {
                ideas:ideas
            });        
        });
});

// Add Idea Form
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});

// Edit Idea Form
app.get('/ideas/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        res.render('ideas/edit', {
            idea:idea 
        }); 
    }); 
});

// Process Form
app.post('/ideas', (req,res) => {
    let errors = [];
    
    if(!req.body.title){
        errors.push({text:'Please add a title'}); 
    }
    if(!req.body.details){
        errors.push({text:'Please add some details'}); 
    }
    
    if(errors.length > 0){
        res.render('ideas/add', {
            errors: errors,
            // Pass in the title so whatever they put in the box doesn't dissapear and it stays
            // The form just gets rerendered
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details
        }
        new Idea(newUser)
            .save()
            .then(idea => {
                res.redirect('/ideas');
        })
    }
});

// Edit Form Process
app.put('/ideas/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id 
    })
    .then(idea => {
        // new values
        idea.title = req.body.title;
        idea.details = req.body.details;
        
        idea.save()
            .then(idea => {
                res.redirect('/ideas');
        })
    });
});

// Delete Idea
app.delete('/ideas/:id', (req, res) => {
    Idea.remove({_id: req.params.id})
        .then(() => {
            res.redirect('/ideas');
        });
});

const port = 4800;

app.listen(port, () =>{ 
    console.log(`Server started on port ${port}`); 
});
