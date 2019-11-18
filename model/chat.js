const mongoose = require('mongoose');

var ChatSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    other: {
        type: Object
    }
});

const Chat = mongoose.model("Chat", ChatSchema)

module.exports = Chat