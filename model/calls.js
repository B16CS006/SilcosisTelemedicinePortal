const connection = require('../database/connection')
const bcrypt = require('bcryptjs')

function Calls(){}

Calls.prototype = {

    findById: function(id, callback){
        let sql = 'SELECT * FROM Calls WHERE myID = ? AND otherID = ?';
        connection.query(sql, [id.myID, id.otherID], (err, result) => {
            if(err){
                console.log(err)
                callback(err, null);
                return;
            }
            callback(null, result[0])
        })
    },

    findCalls : function(myID, callback){
        let sql = 'SELECT * FROM Calls WHERE myID = ?';
        connection.query(sql, myID, (err, result) => {
            if(err){
                console.log(err)
                callback(err, null);
                return;
            }
            callback(null, result)
        })
    },

    create : function(data, callback){
        let sql = 'INSERT INTO Calls SET ?';
        let newCall = {myID: data.myID, otherID: data.otherID, type: data.type, code: data.code}
        connection.query(sql, newCall, (err, _) => {
            if(err){
                callback(err, false)
                return
            }else{
                callback(null, true)
                return
            }
        })
    },

    deleteById: function(id, callback){
        let sql = 'DELETE FROM Calls WHERE myID = ? AND otherID = ?';
        connection.query(sql, [id.myID, id.otherID], (err, _) => {
            if(err){
                callback(err, false)
                return
            }else{
                callback(null, true)
            }
        })
    }
}

module.exports = Calls;