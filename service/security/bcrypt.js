const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports={
    getIncrypt:function(password){
        return new Promise((resove,reject)=>{
            bcrypt.hash(password, saltRounds, function(err, hash) {
                if(err){
                    reject(err)
                }
                else{
                    resove(hash)
                };
            });
        })
    },
    compare:function(password, hashPassword){
        return new Promise((resove,reject)=>{
            bcrypt.compare(password, hashPassword, function(err, result) {
                if(err){
                    reject(err)
                }
                else{
                    resove(result)
                };
            });
        })
    }
}