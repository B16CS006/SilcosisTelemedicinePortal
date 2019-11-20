// const mongoose = require('mongoose');

// var PatientDetailsSchema = new mongoose.Schema({
//     email: {
//         type: String,
//         required: true
//     },
//     date: {
//         type: Date
//     },
//     place: {
//         type: String
//     },
//     regNumber: {
//         type: String
//     },
//     BOCW_ID_Number:{
//         type:String
//     },
//     name:{
//         type: String
//     },
//     aadharNumber:{
//         type: String
//     },
//     dob:{
//         type: Date
//     },
//     age:{
//         type: Number
//     },
//     weight: {
//         type: Number
//     },
//     sex: {
//         type: String
//     },
//     address: {
//         type: Object
//     },
//     mobileNumber: {
//         type: String
//     },
//     presentOccupation: {
//         type: Object
//     },
//     occupationHistory: {
//         type: Object
//     },
//     historyOfSmoking: {
//         type: String
//     },
//     chiefComplaints: {
//         type: Object
//     },
//     duration_suffer: {
//         type: String
//     },
//     photograph: {
//         type: Boolean
//     },
//     xRayReport: {
//         type: Boolean
//     },
//     ctScanReport: {
//         type: Boolean
//     }
// });

// const PatientDetails = mongoose.model("PatientDetails", PatientDetailsSchema)

// module.exports = PatientDetails


const connection = require('../database/connection')

function PatientForm() { }

PatientForm.prototype = {

    findById: function (id, callback) {
        let sql = 'SELECT * FROM PatientForm WHERE formID = ?';
        connection.query(sql, id, (err, result) => {
            if (err) {
                console.log(err)
                callback(err, null);
                return;
            }
            callback(null, result[0])
        })
    },

    findByBOCW_ID: function (BOCW_ID_Number, callback) {
        let sql = 'SELECT * FROM User WHERE BOCWIDNumber = ?';
        connection.query(sql, BOCW_ID_Number, (err, result) => {
            if (err) {
                console.log(err)
                callback(err, null);
                return;
            }
            callback(null, result[0])
        })
    },

    createNewForm: function (data, callback) {
        let newForm = {
            date: data.date,
            place: data.place,
            regNumber: data.regNumber,
            BOCWIDNumber: data.BOCWIDNumber,
            name: data.name,
            aadharNumber: data.aadharNumber,
            dob: data.dob,
            age: data.age,
            weight: data.weight,
            sex: data.sex,
            address: data.address,
            district: data.district,
            state: data.state,
            country: data.country,
            pincode: data.pincode,
            mobileNumber: data.mobileNumber,
            presentOccupation: data.presentOccupation,
            presentOccupationOther: data.presentOccupationOther,
            occHisConstruction: data.occHisConstruction,
            occHisMines: data.occHisMines,
            occHisOtherOccupation: data.occHisOtherOccupation,
            occHisOther: data.occHisOther,
            historyOfSmoking: data.historyOfSmoking,
            chiefComplaints: data.chiefComplaints,
            chiefComplaintsOther: data.chiefComplaintsOther,
            duration_suffer: data.duration_suffer,
            photograph: data.photograph,
            xRayReport: data.xRayReport,
            ctScanReport: data.ctScanReport,
            updated: data.updated,
            created: data.created,
        }
        let sql = 'INSERT INTO PatientForm SET ?';
        connection.query(sql, newForm, (err, result) => {
            if (err) {
                callback(err, null)
                return
            } else {
                callback(null, result)
                return
            }
        })
    },

    updateForm: function(data, callback){
        if(!data.formID){
            callback('Missing formID', null)
            return
        }

        let sql = 'UPDATE PatientForm SET ? WHERE formID = ?';
        connection.query(sql, [data, data.formID], (err, result) => {
            if(err){
                callback(err, null)
                return
            }else{
                callback(null, true)
                return
            }
        })
    },

    deleteFormById: function(formID, callback){
        if(formID){
            let sql = 'DELETE FROM PatientForm WHERE formID = ?';
            connection.query(sql, formID, (err, result) => {
                if(err){
                    callback(err, null)
                    return
                }else{
                    callback(null, true)
                    return
                }
            })
        }else{
            callback('Please Pass formID', null)
        }
    },

    deleteFormByBOCWID: function(BOCWIDNumber, callback){
        if(formID){
            let sql = 'DELETE FROM PatientForm WHERE BOCWIDNumber = ?';
            connection.query(sql, BOCWIDNumber, (err, result) => {
                if(err){
                    callback(err, null)
                    return
                }else{
                    callback(null, true)
                    return
                }
            })
        }else{
            callback('Please Pass formID', null)
        }
    }
}

module.exports = PatientForm;
