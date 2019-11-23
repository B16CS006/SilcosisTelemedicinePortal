const mysql = require('mysql')
const { databaseConfig } = require('../config/configuration')

var execQuery = function(sql, data, callback){
    const connection = mysql.createConnection(databaseConfig)
    connection.connect()
    connection.query(sql, data, (err, result) => {
        callback(err, result);
    })
    connection.end()
}

module.exports = execQuery