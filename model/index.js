// const mongoose = require('mongoose')

// mongoose.connect('mongodb://localhost:27017/Telemedicine', {useNewUrlParser: true})
// .then(() => console.log('MongoDb Connected'))
// .catch(err => console.log(err))

// const User = require("./User")

// const { databaseConfig } = require('../config/configuration')

// var mysql = require('mysql')

// var connection = mysql.createConnection(databaseConfig)

// connection.connect((err) => {
//     if(err){
//         console.error('error connecting: ' + err);
//         return
//     }
//     console.log('Database connected as id: ' + connection.threadId);
//     var userSqlTable = 'CREATE TABLE User(formID int AUTO_INCREMENT, email VARCHAR(255), password VARCHAR(255), name VARCHAR(255), role VARCHAR(50), mobileNumber VARCHAR(15), PRIMARY KEY(formID))';
//     connection.query(userSqlTable, (err, result) => {
//         if(err) console.log(err.code);
//         else console.log('User Table Created: ');
//     })
// })

// module.exports = connection




// var execQuery = function(sql){
//     connection.query(sql, (err, result) => {
//         if(err) return err;
//         console.log(result);
//         return result
//     })
// }

// var tableExist = function(tablename){
//     var sql = 'SELECT to_regclass(schema_name.table_name)'
//     connection.query()
// }