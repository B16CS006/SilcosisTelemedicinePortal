const mysql = require('mysql')
const { databaseConfig } = require('../config/configuration')

var execQuery = function(sql, data, callback){
    const connection = mysql.createConnection(databaseConfig)
    connection.connect()
    connection.query(sql, data, (err, result) => {
        connection.end()
        callback(err, result);
    })
}


// Connecting to Database
// connection.connect((err) => {
//     if (err) {
//         console.error('error connecting: ' + err);
//         return
//     }
//     console.log('Database connected as id: ' + connection.threadId);
//     createDatabase()
// })

module.exports = execQuery