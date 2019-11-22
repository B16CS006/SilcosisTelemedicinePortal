const connection = require('../database/connection')
const bcrypt = require('bcryptjs')

function Calls(){}

Calls.prototype = {

    findReply: function(data, callback) {
        let sql = 'SELECT * FROM Calls Where myID = ? AND otherID = ? AND type = "reply"'
        connection.query(sql, [data.myID, data.otherID], (err, result) => {
            if(err){
                console.log(err)
                callback(err, null);
                return;
            }
            callback(null, result[0])
        })
    },

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

    findIncomingCalls : function(userID, callback){
        let sql = 'SELECT * FROM Calls WHERE otherID = ? AND type = "init"';
        connection.query(sql, userID, (err, result) => {
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