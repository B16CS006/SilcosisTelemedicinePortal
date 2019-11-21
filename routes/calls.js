const express = require('express');

const { ensureAuthenticated } = require('../config/auth')

const router = express.Router();
const Calls = require('../model/calls')
const CallsModel = new Calls()

router.get('/', ensureAuthenticated, (req, res) => {
    res.render('calls')
})

router.post('/create', ensureAuthenticated, (req, res) => {
    CallsModel.create({myID: req.user.email, otherID: req.body.otherID, type: req.body.type, code: req.body.code}, (err, result) => {
        if(err){
            res.send({error: err})
            return
        }else if(result){
            res.send({message: 'Successfully Created'})
            return
        }else{
            res.send({error: 'Unknown Error'})
            return
        }
    })
})

module.exports = router