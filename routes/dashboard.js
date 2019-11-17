const express = require('express');
const mongoose = require('mongoose');

const { ensureAuthenticated } = require('../config/auth')

const router = express.Router();
const PatientDetails = require('../model/User')
// const PatientDetailsModle = mongoose.model("User")


router.get('/', ensureAuthenticated, (req, res) => {
    res.render('dashboard')
})

router.get('/patient-form', ensureAuthenticated, (req, res) => {
    res.render('patientForm')
})

router.post('/patient-form', ensureAuthenticated, (req, res, next) => {
    let formidable = require('formidable')

    var form = new formidable.IncomingForm();
    form.uploadDir = 'uploads'
    form.keepExtensions = true
    form.maxFileSize = 10 * 1024 * 1024
    form.multiples = false;
    form.parse(req)

    form.on('fileBegin', (name, file) => {
        console.log(name + ', ' + file)
        file.path = 'uploads/' + name + '.' + file.name.split('.')[1]
    })

    form.on('file', (name, file) => {
        console.log(file)
    })

    res.send('Done')
})

module.exports = router