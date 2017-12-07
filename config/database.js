if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI: 'mongodb://<tabias>:<tabias>@ds033186.mlab.com:33186/videopad-prod'}
} else{
    module.exports = {mongoURI: 'mongodb://localhost/VideoPad-dev'}  
}