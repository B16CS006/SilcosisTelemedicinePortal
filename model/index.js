const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/Telemedicine', {useNewUrlParser: true})
.then(() => console.log('MongoDb Connected'))
.catch(err => console.log(err))

// const User = require("./User")