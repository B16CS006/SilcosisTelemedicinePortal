const mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    role:{
        type:String, 
        required: true
    },
    phoneNumber:{
        type: String
    },
    uuid:{
        type: String
    },
    date:{
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model("User", UserSchema)

module.exports = User