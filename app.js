// Used to bring in Express
const express = require('express'); 
const path = require('path'); 
const exphbs  = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash'); 
const session = require('express-session'); 
const bodyParser = require('body-parser');
const passport = require('passport'); 
const mongoose = require('mongoose'); 

// Initialize Application
const app = express(); 

// Load Routes
const ideas = require('./routes/ideas'); 
const users = require('./routes/users'); 

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/database'); 

// Map Global Promise - get rid of warning
mongoose.Promise = global.Promise; 

// Connect to Mongoose
mongoose.connect(db.mongoURI, {
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

// Passport middleware. This has to go after Express Session middleware or it will cause issues
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global Variables
app.use(function(req, res, next){
    res.locals.msg_success = req.flash('msg_success');
    res.locals.msg_error = req.flash('msg_error');
    // This is for later for implementing passport for User Authentication
    res.locals.error = req.flash('error'); 
    // WHen you're logged in, you have access to a request object called user. So here we create a global variable for that object
    // So if there is an user, we cam hide certain elements such as login/register buttons 
    res.locals.user = req.user || null; 
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

// Heroku chooses a port for you so we made it where Heroku can choose 
const port = process.env.PORT || 5000;

app.listen(port, () =>{ 
    console.log(`Server started on port ${port}`); 
});