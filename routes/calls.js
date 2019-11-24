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

router.post('/initCall', ensureAuthenticated, express.json({type: '*/*'}), (req, res) => {
    console.log('initCall')
    
    let data = {myID: req.user.email, otherID: req.body.otherID, type: 'init', code: req.body.code}
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

router.post('/replyCall', ensureAuthenticated, express.json({type: '*/*'}), (req, res) => {
    // console.log('replyCall')
    
    let data = {myID: req.user.email, otherID: req.body.otherID, type: 'reply', code: req.body.code}
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

router.post('/getReply', ensureAuthenticated, express.json({type: '*/*'}), (req, res) => {
    // console.log('getReply')

    let data = {myID: req.body.otherID, otherID: req.user.email};
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

router.post('/getIncoming', ensureAuthenticated, express.json({type: '*/*'}), (req, res) => {
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



router.post('/accept', ensureAuthenticated, express.json({type: '*/*'}), (req, res) => {
    console.log(req.body.code)
    res.render('videoChat', {otherID: req.body.otherID, code: JSON.stringify(req.body.code)})
})

router.post('/disconnect', ensureAuthenticated, express.json({type: '*/*'}), (req, res) => {
    let data = {myID: req.user.email, otherID: req.body.otherID}
    
    CallsModel.deleteById(data, (err, result) => {
        if(err){
            res.send({error: err})
            return
        }else{
            res.send({message: 'Successfully deleted'})
        }
    })
})



module.exports = router