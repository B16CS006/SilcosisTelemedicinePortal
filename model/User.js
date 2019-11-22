const execQuery = require('../database/connection')
const bcrypt = require('bcryptjs')

function User(){}

User.prototype = {

    findById: function(id, callback){
        let sql = 'SELECT * FROM User WHERE userID = ?';
        execQuery(sql, id, (err, result) => {
            if(err){
                console.log(err)
                callback(err, null);
                return;
            }
            callback(null, result[0])
        })
    },

    find : function(email, callback){
        let sql = 'SELECT * FROM User WHERE email = ?';
        execQuery(sql, email, (err, result) => {
            if(err){
                console.log(err)
                callback(err, null);
                return;
            }
            callback(null, result[0])
        })
    },

    create : function(data, callback){
        this.find(data.email, (err, user)=>{
            if(err){
                callback(err, null)
                return
            }else if(user){
                callback({code: 'User Alread Existed'}, null)
                return
            }else{
                let password = data.password;
                data.password = bcrypt.hashSync(password, 10);;
                let newUser = { email: data.email, password: data.password, name: data.name, role: data.role, mobileNumber: data.mobileNumber }
                let sql = 'INSERT INTO User SET ?';
                execQuery(sql, newUser, (err, _) => {
                    if(err){
                        callback(err, false)
                        return
                    }else{
                        callback(null, true)
                        return
                    }
                })
            }
        })
    }
}

module.exports = User;