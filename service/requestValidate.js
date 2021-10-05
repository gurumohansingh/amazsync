const jwt = require('jsonwebtoken');

module.exports = {

    validateToken: (req, res, next) => {
        const token = req.headers["authorization"];
        if (!token) {
            return res.sendStatus(401);
        }
        jwt.verify(token, process.env.SECRETKEY, (err, user) => {
            if (err) {
                return res.sendStatus(401);
            }
            else {
                req.loggedUser = user
                next();
            }
        })
    },
    validateTokenByToken: (token) => {   
        return new Promise((resove,reject)=>{    
            jwt.verify(token, process.env.SECRETKEY, (err, user) => {
                if (err) {
                    reject()
                }
                else {
                    resove();
                }
            })
        })
    },

    jwtNewToken: (user,role) => {      
        const token = jwt.sign({ username: user,  role: role }, process.env.SECRETKEY);
        return token;
    }
}