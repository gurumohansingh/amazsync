const jwt = require('jsonwebtoken');
var { login } = require('../util/sqlquery');
const mysql = require('./mysql');
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
                mysql.query(login, user.username)
                    .then((result) => {
                        if (result.length > 0) {
                            next();
                        }
                        else {
                            res.sendStatus(401)
                        }
                    })
            }
        })
    },
    validateTokenByToken: (token) => {
        return new Promise((resove, reject) => {
            jwt.verify(token, process.env.SECRETKEY, (err, user) => {
                if (err) {
                    reject()
                }
                else {
                    mysql.query(login, user.username)
                        .then((result) => {
                            if (result.length > 0) {
                                resove({ userRoles: user.role, userName: result[0].firstname });
                            }
                            else {
                                res.sendStatus(401)
                            }
                        })

                }
            })
        })
    },

    jwtNewToken: (user, role, marketPlaceId) => {
        const token = jwt.sign({ username: user, role: role, marketPlaceId: marketPlaceId }, process.env.SECRETKEY);
        return token;
    },

    logout: (user) => {
        jwt.destroy();
    },

    authorization: (role) => {
        return function (req, res, next) {
            const token = req.headers["authorization"];
            jwt.verify(token, process.env.SECRETKEY, (err, user) => {

                if (err) {
                    return res.sendStatus(401);
                }
                else {
                    var userRoles = user.role.split(",");
                    mysql.query(login, user.username)
                        .then((result) => {
                            var dbRoles = result[0] && result[0].role.split(",");
                            if (userRoles.includes(role) && dbRoles.includes(role)) {
                                next();
                            }
                            else {
                                res.sendStatus(401)
                            }
                        })
                }
            })
        }
    },

    authorizationForm: (role) => {
        return function (req, res, next) {
            let token;
            if (req.method === "GET") {
                token = req.query["Authorization"];
            }
            else {
                token = req.body["Authorization"];
            }
            jwt.verify(token, process.env.SECRETKEY, (err, user) => {

                if (err) {
                    return res.sendStatus(401);
                }
                else {
                    var userRoles = user.role.split(",");
                    mysql.query(login, user.username)
                        .then((result) => {
                            var dbRoles = result[0] && result[0].role.split(",");
                            if (userRoles.includes(role) && dbRoles.includes(role)) {
                                next();
                            }
                            else {
                                res.sendStatus(401)
                            }
                        })
                }
            })
        }
    },
}