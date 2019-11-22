const mysql = require('mysql')
const { databaseConfig } = require('../config/configuration')

const connection = mysql.createConnection(databaseConfig)

var userSqlTable = 'CREATE TABLE User(userID int UNSIGNED NOT NULL AUTO_INCREMENT, email VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, name VARCHAR(255) NOT NULL, role VARCHAR(50) NOT NULL, mobileNumber VARCHAR(15), created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(userID))';
var patientFormTable = 'CREATE TABLE PatientForm(formID int UNSIGNED NOT NULL AUTO_INCREMENT' 
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
                        + ', photograph TINYINT'
                        + ', xRayReport TINYINT'
                        + ', ctScanReport TINYINT'
                        + ', updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP'
                        + ', created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(formID))'

var callsInfoTable = 'CREATE TABLE Calls(callID int UNSIGNED NOT NULL AUTO_INCREMENT, myID VARCHAR(255) NOT NULL, otherID VARCHAR(255) NOT NULL, created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, type VARCHAR(10) NOT NULL, code VARCHAR(8000) NOT NULL, PRIMARY KEY(callID))';


var execQuery = function(sql){
    connection.query(sql, (err, result) => {
        if (err) console.log(err);
        else console.log('Table Created: ');
    })
}

var createTables = function(){
    execQuery(userSqlTable)
    execQuery(patientFormTable)
    execQuery(callsInfoTable)
}

var createDatabase = function(){
    createTables()
}

// Connecting to Database
connection.connect((err) => {
    if (err) {
        console.error('error connecting: ' + err);
        return
    }
    console.log('Database connected as id: ' + connection.threadId);
    // createDatabase()
})

module.exports = connection