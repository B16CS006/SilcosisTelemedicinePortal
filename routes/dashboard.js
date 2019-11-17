const express = require('express');

const { ensureAuthenticated } = require('../config/auth')

const router = express.Router();
const PatientDetails = require('../model/PatientForm')
// const PatientDetailsModle = mongoose.model("User")


router.get('/', ensureAuthenticated, (req, res) => {
    res.render('dashboard')
})

router.get('/patient-form', ensureAuthenticated, (req, res) => {
    res.render('patientForm')
})

router.post('/patient-form', ensureAuthenticated, (req, res) => {
    let formidable = require('formidable')
    let fs = require('fs')

    const newDetails = new PatientDetails({ email: req.user.email })

    var uploadDir = 'uploads/' + newDetails._id
    if(!fs.existsSync(uploadDir)){
        fs.mkdirSync(uploadDir)
    }

    var form = new formidable.IncomingForm();
    form.uploadDir = uploadDir
    form.keepExtensions = true
    form.maxFileSize = 10 * 1024 * 1024
    form.multiples = false;
    
    form.parse(req, (err,fields, files)=>{
        console.log(files)
        // console.log('.....................................')
        if(err){
            console.log('error parse: ' + err)
            res.send({error: err})
        }else{
            newDetails.date = fields.date
            newDetails.place = fields.place
            newDetails.regNumber = fields.regNumber
            newDetails.BOCW_ID_Number = fields.BOCW_ID_Number
            newDetails.name = fields.name
            newDetails.aadharNumber = fields.aadharNumber
            newDetails.dob = fields.dob
            newDetails.age = fields.age
            newDetails.weight = fields.weight
            newDetails.sex = fields.sex
            newDetails.address = {
                address: fields.address, 
                district: fields.district, 
                state: fields.state, 
                country: fields.country, 
                pincode: fields.pincode
            }
            newDetails.mobileNumber = fields.mobileNumber
            newDetails.presentOccupation = {
                presentOccupation: fields.presentOccupation,
                other: fields.presentOccupationOther
            }
            newDetails.occupationHistory = {
                construction: {
                    check: fields.occHisConstrCheck,
                    value: fields.occHisConstrValue
                },
                mines: {
                    check: fields.occHisMinesCheck,
                    value: fields.occHisMinesValue
                },
                other: {
                    check: fields.occHisOtherCheck,
                    occupation: fields.occHisOtherOcc,
                    value: fields.occHisOtherValue
                }
            }
            newDetails.historyOfSmoking = fields.historyOfSmoking
            newDetails.chiefComplaints = {
                chiefComplaints: fields.chiefComplaints,
                other: fields.chiefComplaintsOther
            }
            newDetails.duration_suffer = fields.duration_suffer
            newDetails.photograph = files.photograph.name? true: false
            newDetails.xRayReport = files.xRayReport.name? true: false
            newDetails.ctScanReport = files.ctScanReport.name? true: false
            // console.log(newDetails)
            newDetails.save()
                .then(details => {
                    // console.log(details)
                    req.flash('success_msg', 'Form is successfully submitted.')
                    res.redirect("/dashboard")
                })
                .catch(err => console.log(err))
        }
    })

 
    form.on('fileBegin', (name, file) => {
        console.log('fileBegin ', + file)
        file.path = uploadDir + '/' + name + '.' + file.name.split('.').pop()
    })

    form.on('file', (name, file) => {
        console.log('file, ' + name)
    })
    console.log('finish')
    // res.send('wow')
})

module.exports = router