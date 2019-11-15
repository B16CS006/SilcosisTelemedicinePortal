var mysql = require('mysql')

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'IITJodhpur',
    password: 'IITJodhpur.16',
    database: 'telemedicineDB'
})

connection.connect(function(error){
    if(error){
        throw error;
    }
    console.log('Database is successfully Connected')
})