const express = require('express');

const { ensureAuthenticated } = require('../config/auth')

const router = express.Router();
const PatientDetail = require('../model/PatientForm')
const PatientDetailModel = new PatientDetail()

router.get('/create', ensureAuthenticated, (req, res) => {
    res.render('patientForm')
})

router.post('/create', ensureAuthenticated, (req, res) => {
    let formidable = require('formidable')
    let fs = require('fs')

    // const newDetails = new PatientDetailModel({ email: req.user.email })
    PatientDetailModel.createNewForm({ userID: req.user.email }, (err, result) => {
        if (err) {
            console.log(err)
            res.send({ error: err })
        } else if (result) {
            // console.log(result.insertId)
            var uploadDir = 'uploads/' + result.insertId
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir)
            }

            var form = new formidable.IncomingForm();
            form.uploadDir = uploadDir
            form.keepExtensions = true
            form.maxFileSize = 100 * 1024 * 1024
            form.multiples = false;

            form.parse(req, (err, fields, files) => {
                if (err) console.error(err)
                var data = Object.assign({}, fields)
                data.userID = req.user.email
                data.formID = result.insertId
                data.photograph = files.photograph.name
                data.xRayReport = files.xRayReport.name
                data.ctScanReport = files.ctScanReport.name
                // console.log('.....................................')
                // console.log(data)
                PatientDetailModel.updateForm(data, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.send({ error: err })
                        return
                    } else {
                        req.flash('success_msg', 'Form is successfully submitted.')
                        res.redirect("/dashboard")
                    }
                })
            })

            form.on('fileBegin', (name, file) => {
                console.log('fileBegin ', + file)
                file.path = uploadDir + '/' + name + '_' + file.name
            })

            form.on('file', (name, file) => {
                console.log('file, ' + name)
            })

        } else {
            console.log('Unknown Error') // TODO
            res.send({ error: err })
        }
    })
})

router.post('/getAll', ensureAuthenticated, express.json({type: '*/*'}), (req, res) => {
    if (req.user.role === 'patient') {
        console.log('Patient')
        PatientDetailModel.findByUserId(req.user.email, (err, result) => {
            if (err) {
                res.send({ error: err })
                return
            } else {
                res.send({ message: 'Success', result: result })
            }
        })
    } else if (req.user.role === 'doctor' || req.user.role === 'admin') {
        console.log('Doctor')
        console.log(req.body)
        PatientDetailModel.findByUserId(req.body.userID, (err, result) => {
            if (err) {
                res.send({ error: err })
                return
            } else {
                res.send({ message: 'Success', result: result })
            }
        })
    } else {
        console.log('getAll unknow error')
    }
})

router.post('/downloadfile', ensureAuthenticated, (req, res) => {
    var file = __dirname +  '/../uploads/' + req.body.filename
    console.log('downloading file', file)
    res.download(file, req.body.filename)
})

module.exports = router