
const port = process.env.PORT || 8008

const express = require('express')
const path = require("path")
const expressHandlebars = require("express-handlebars")
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

const app = express()

// Passport config
require('./config/passport')(passport)

// Bodyparswer
app.use(bodyParser.urlencoded({extended: false}))

// Express Handlebars
app.set('views', path.join(__dirname, "/views/"));
app.engine("hbs", expressHandlebars({
    extname: "hbs",
    defaultLayout: "mainLayout", 
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + '/views/partials'
}));
app.set('view engine', 'hbs')

// Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true }
}))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Connect flash
app.use(flash())


// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})

//Routes
app.use('/', require('./routes/index'))
app.use('/user', require('./routes/user'))
app.use('/dashboard', require('./routes/dashboard'))
app.use('/chat', require('./routes/chat'))
app.use('/calls', require('./routes/calls'))
app.use('/database', require('./routes/database'))
app.use('/patientForm', require('./routes/patientForm'))

app.use('/bundle', express.static(__dirname + '/js/bundle'))




/////////////////////////////////////////////////////////////////////////
//  app.use(express.static(publicFolder))

// const http = require('http').Server(app)
// const io = require('socket.io')(http)



// let clients = 0

// io.on('connection', function (socket) {
//     socket.on('NewClient', function () {
//         console.log(`clieint ${clients}`)
//         if (clients < 2) {
//             if (clients == 1) {
//                 this.emit('CreatePeer')
//             }
//         } else {
//             this.emit('SessionActive')
//         }
//         clients++;
//     })
//     socket.on('Offer', SendOffer)
//     socket.on('Answer', SendAnswer)
//     socket.on('disconnect', Disconnect)
// })

// function Disconnect() {
//     if (clients > 0) {
//         clients--;
//     }
// }

// function SendOffer(offer) {
//     this.broadcast.emit('BackOffer', offer)
// }

// function SendAnswer(data) {
//     this.broadcast.emit('BackAnswer', data)
// }


// app.get('/login', function (req, res) {
//     res.sendFile(publicFolder + 'auth/login.html');
// });

// app.post('/login', function(req, res){
//     console.log(req.body);
//     res.send(true);
//     res.end();
// })

// var MongoClient = require('mongodb').MongoClient;

// MongoClient.connect("mongodb://localhost:27017/MyDB", function(err, db){
//     if(err) throw err;
//     console.log('Connection established with database');
// })
/////////////////////////////////////////////////////////////////////////////////////////////////////

app.listen(port, '0.0.0.0', () => {
    console.log(`Active on ${port} port.`)
})