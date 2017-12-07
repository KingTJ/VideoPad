const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 

// Create Schema
const IdeaSchema = new Schema({
    title:{
        type: String, 
        required: true
    },
    details:{
        type: String,
        required: true
    },
    // This user field is so that we can tag that user's id to the specefic idea they created
    user:{
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now 
    }
}); 

mongoose.model('ideas', IdeaSchema);