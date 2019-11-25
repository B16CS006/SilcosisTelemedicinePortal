const express = require('express');

const execQuery = require('../database/connection')

// const { ensureAuthenticated } = require('../config/auth')

const router = express.Router();

var userSqlTable = 'CREATE TABLE User(userID int UNSIGNED NOT NULL AUTO_INCREMENT, email VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, name VARCHAR(255) NOT NULL, role VARCHAR(50) NOT NULL, mobileNumber VARCHAR(15), created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(userID))';
var patientFormTable = 'CREATE TABLE PatientForm(formID int UNSIGNED NOT NULL AUTO_INCREMENT'
                        + ', userID VARCHAR(255) NOT NULL'
                        + ', date TIMESTAMP'
                        + ', place VARCHAR(255)'
                        + ', regNumber VARCHAR(255)'
                        + ', BOCWIDNumber VARCHAR(255)'
                        + ', name VARCHAR(255)'
                        + ', aadharNumber VARCHAR(20)'
                        + ', dob VARCHAR(30)'
                        + ', age int UNSIGNED'
                        + ', weight int UNSIGNED'
                        + ', sex VARCHAR(10)'
                        + ', address VARCHAR(255)'
                        + ', district VARCHAR(255)'
                        + ', state VARCHAR(50)'
                        + ', country VARCHAR(50)'
                        + ', pincode VARCHAR(10)'
                        + ', mobileNumber VARCHAR(15)'
                        + ', presentOccupation VARCHAR(255)'
                        + ', presentOccupationOther VARCHAR(255)'
                        + ', occHisConstruction int UNSIGNED'
                        + ', occHisMines int UNSIGNED'
                        + ', occHisOtherOccupation VARCHAR(255)'
                        + ', occHisOther int UNSIGNED'
                        + ', historyOfSmoking VARCHAR(10)'
                        + ', chiefComplaints VARCHAR(255)'
                        + ', chiefComplaintsOther VARCHAR(255)'
                        + ', duration_suffer VARCHAR(255)'
                        + ', photograph VARCHAR(255)'
                        + ', xRayReport VARCHAR(255)'
                        + ', ctScanReport VARCHAR(255)'
                        + ', updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP'
                        + ', created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(formID))'

var callsInfoTable = 'CREATE TABLE Calls(callID int UNSIGNED NOT NULL AUTO_INCREMENT, myID VARCHAR(255) NOT NULL, otherID VARCHAR(255) NOT NULL, created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, type VARCHAR(10) NOT NULL, code VARCHAR(8000) NOT NULL, PRIMARY KEY(callID))';

var createTables = function(){
    execQuery(userSqlTable, null, (error, result) => {console.log(error, result)})
    execQuery(patientFormTable, null, (error, result) => {console.log(error, result)})
    execQuery(callsInfoTable, null, (error, result) => {console.log(error, result)})
}

var createDatabase = function(){
    console.log('Creating Database')
    createTables()
}

var clearTable = function(table, callback) {
    console.log('deleting database')
    execQuery('DELETE FROM TABLE ' + table, null, (error, result) => {
        console.log(error, result)
        callback({error, result})
    })
}

var deleteTable = function(table, callback){
    console.log('deleting table: ' + table)
    execQuery('DROP TABLE ' + table, null, (error, result) => {
        console.log(error, result)
        callback({error, result})
    })
}

router.get('/createDatabase', (req, res) => {
    res.render('database', {link: 'createDatabase'})
})

router.get('/clearTable/:table', (req, res) => {
    res.render('database', {link: 'clearTable/' + req.params.table})
})

router.get('/deleteTable/:table', (req, res) => {
    res.render('database', {link: 'deleteTable/' + req.params.table})
})

router.post('/createDatabase', (req, res) => {
    if(req.body.password == 'somerandompasswordIITJodhpur'){
        createDatabase()
        res.send('done')
    }else{
        res.send('Incorrect Password')
    }
})

router.post('/clearTable/:table', (req, res) => {
    if(req.body.password == 'somerandompasswordIITJodhpur'){
        clearTable(req.params.table, (result) => {
            res.send(result)
        })
    }else{
        res.send('Incorrect Password')
    }
})

router.post('/deleteTable/:table', (req, res) => {
    if(req.body.password === 'somerandompasswordIITJodhpur'){
        deleteTable(req.params.table, (result) => {
            res.send(result)
        })
    }else{
        res.send('Incorrect Password')
    }
})

module.exports = router