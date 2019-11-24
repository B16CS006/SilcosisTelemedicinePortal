const execQuery = require('../database/connection')

function PatientForm() { }

PatientForm.prototype = {

    query: function(sql, data, callback){
        console.log(sql)
        console.log(data)
        execQuery(sql, data, (err, result) => {
            if(err){
                console.log(err)
                callback(err, null)
                return
            }else{
                callback(null, result)
            }
        })
    },

    findById: function (id, callback) {
        let sql = 'SELECT * FROM PatientForm WHERE formID = ?';
        execQuery(sql, id, (err, result) => {
            if (err) {
                console.log(err)
                callback(err, null);
                return;
            }
            callback(null, result[0])
        })
    },

    findByBOCW_ID: function (BOCW_ID_Number, callback) {
        let sql = 'SELECT * FROM PatientForm WHERE BOCWIDNumber = ?';
        execQuery(sql, BOCW_ID_Number, (err, result) => {
            if (err) {
                console.log(err)
                callback(err, null);
                return;
            }
            callback(null, result[0])
        })
    },

    findByUserId: function(userID, callback){
        let sql = 'SELECT * FROM PatientForm WHERE userID = ?';
        execQuery(sql, userID, (err, result) => {
            if (err) {
                console.log(err)
                callback(err, null);
                return;
            }
            callback(null, result)
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
        execQuery(sql, newForm, (err, result) => {
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
        execQuery(sql, [data, data.formID], (err, result) => {
            if(err){
                callback(err, null)
                return
            }else{
                callback(null, true)
                return
            }
        })
    },

    deleteFormByUserId: function(userID, callback){
        if(userID){
            let sql = 'DELETE FROM PatientForm WHERE userID = ?';
            execQuery(sql, userID, (err, _) => {
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

    deleteFormById: function(formID, callback){
        if(formID){
            let sql = 'DELETE FROM PatientForm WHERE formID = ?';
            execQuery(sql, formID, (err, _) => {
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
            execQuery(sql, BOCWIDNumber, (err, _) => {
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
