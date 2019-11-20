const express = require('express');

const { ensureAuthenticated } = require('../config/auth')

const router = express.Router();
const PatientDetail = require('../model/PatientForm')
const PatientDetailModel = new PatientDetail()

router.get('/', ensureAuthenticated, (req, res) => {
    res.render('dashboard')
})

router.get('/patient-form', ensureAuthenticated, (req, res) => {
    res.render('patientForm')
})

router.get('/calls', ensureAuthenticated, (req, res) => {
    res.render('calls')
})

router.post('/patient-form', ensureAuthenticated, (req, res) => {
    let formidable = require('formidable')
    let fs = require('fs')

    // const newDetails = new PatientDetailModel({ email: req.user.email })
    PatientDetailModel.createNewForm({ name: 'chetan', place: 'Jodhpur' }, (err, result) => {
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
                data.formID = result.insertId
                data.photograph = (files.photograph.name === '' || files.photograph.name === undefined || files.photograph.name === null) ? 0 : 1
                data.xRayReport = (files.xRayReport.name === '' || files.xRayReport.name === undefined || files.xRayReport.name === null) ? 0 : 1
                data.ctScanReport = (files.ctScanReport.name === '' || files.ctScanReport.name === undefined || files.ctScanReport.name === null) ? 0 : 1
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
                file.path = uploadDir + '/' + name + '.' + file.name.split('.').pop()
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

module.exports = router