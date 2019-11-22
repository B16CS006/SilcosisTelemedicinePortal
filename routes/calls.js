const express = require('express');

const { ensureAuthenticated } = require('../config/auth')

const router = express.Router();
const Calls = require('../model/calls')
const CallsModel = new Calls()

router.get('/', ensureAuthenticated, (req, res) => {
    res.render('calls', {user: req.user})
})

// router.get('/initCall', ensureAuthenticated, (req, res) => {
//     res.render('videoChat')
// })

router.post('/initCall', ensureAuthenticated, (req, res) => {
    console.log('initCall')
    let body = JSON.parse(req.body.data)
    
    let data = {myID: req.user.email, otherID: body.otherID, type: 'init', code: body.code}
    console.log('data', data)
    CallsModel.create(data, (err, result) => {
        if(err){
            res.send({error: err})
            return
        }else if(result){
            console.log('initCall', result)
            res.send({message: 'Your Call is successfully initiated'})
            return
        }else{
            res.send({error: 'Unknown Error'})
            return
        }
    })
})

router.post('/replyCall', ensureAuthenticated, (req, res) => {
    // console.log('replyCall')
    let body = JSON.parse(req.body.data)
    
    let data = {myID: req.user.email, otherID: body.otherID, type: 'reply', code: body.code}
    // console.log('data', data)
    CallsModel.create(data, (err, result) => {
        if(err){
            res.send({error: err})
            return
        }else if(result){
            // console.log('replyCall', result)
            res.send({message: 'Your Call is successfully replied back'})
            return
        }else{
            res.send({error: 'Unknown Error'})
            return
        }
    })
})

router.post('/getReply', ensureAuthenticated, (req, res) => {
    // console.log('getReply')
    let body = JSON.parse(req.body.data)

    let data = {myID: body.otherID, otherID: req.user.email};
    // console.log('data', data)
    CallsModel.findReply(data, (err, result) => {
        console.log(err, result)
        if(err){
            res.send({error: err})
            return
        }else if(result){
            // console.log(result)
            res.send({message: 'Successfully Refreshed', code: result.code})
            return
        }else{
            res.send({error: 'Unknown Error'})
            return
        }
    })
})

router.post('/getIncoming', ensureAuthenticated, (req, res) => {
    CallsModel.findIncomingCalls(req.user.email, (err, result) => {
        if(err){
            res.send({error: err})
            return
        }else if(result){
            // console.log(result)
            res.send({message: 'Successfully', code: result})
            return
        }else{
            res.send({error: 'Unknown Error'})
            return
        }
    })
})



module.exports = router