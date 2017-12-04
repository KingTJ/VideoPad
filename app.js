// Used to bring in Express
const express = require('express'); 
const path = require('path'); 
const exphbs  = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash'); 
const session = require('express-session'); 
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose'); 

// Initialize Application
const app = express(); 

// Load Routes
const ideas = require('./routes/ideas'); 
const users = require('./routes/users'); 

// Map Global Promise - get rid of warning
mongoose.Promise = global.Promise; 

// Connect to Mongoose
mongoose.connect('mongodb://localhost/VideoPad-dev', {
    useMongoClient: true
})
// The then statement catches the promise after connecting to the database
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));


// HandleBars Middleware
// I'm telling system that we want to use the HandleBars template engine
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Static folder
// Sets public folder to be the express static folder so you can use any static assets in that folder
app.use(express.static(path.join(__dirname, 'public')));

// Method Override Middleware
app.use(methodOverride('_method')); 

// Express Session Middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}))

app.use(flash());

// Global Variables
app.use(function(req, res, next){
    res.locals.msg_success = req.flash('msg_success');
    res.locals.msg_error = req.flash('msg_error');
    // This is for later for implementing passport for User Authentication
    res.locals.error = req.flash('error'); 
    next(); 
});

// Index Route
app.get('/', (req, res) => {
    const title = 'Keep up with your ideas.'; 
    res.render('index', {
        title: title
    });
}); 

// About Route
app.get('/about', (req, res) => {
    res.render('about');
});

// Use Routes
app.use('/ideas', ideas);
app.use('/users', users);

const port = 5000;

app.listen(port, () =>{ 
    console.log(`Server started on port ${port}`); 
});