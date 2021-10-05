const mysql = require('./mysql');
const { jwtNewToken } = require('./requestValidate');
const { compare, getIncrypt } = require('./security/bcrypt');

class usersService {
    login = function (userName, password) {
        return new Promise((resolve, reject) => {
            mysql.query(`select password,role from users where email= '${userName}'`, null)
                .then(response => {
                    if (response.length > 0) {
                        compare(password, response[0]["password"])
                            .then((checkPassword) => {
                                const token = jwtNewToken(userName, response[0].role);
                                resolve(token);
                            })
                            .catch(error => {
                                reject("Incorrect user name or password");
                            })
                    }
                    else {
                        reject("Incorrect user name or password");
                    }
                })
                .catch(error => {
                    reject("Incorrect user name or password");
                })
        })
    }
    registerUser = async function (user) {
        user["password"] = await getIncrypt(user["password"]);
        return new Promise((resolve, reject) => {
            try {
                mysql.query(`select email from users where email ='${user.email.trim()}'`, null)
                    .then(response => {
                        if (response.length > 0) {
                            reject(`User with ${user.email} already exist`);
                        }
                        else {
                            mysql.query(`insert into users set ?`, user)
                                .then(response => {
                                    if (response.affectedRows > 0) {
                                        resolve("created")
                                    }
                                    else {
                                        reject("Something wrong!! Please contact to Admin");
                                    }
                                })
                                .catch(error => {
                                    reject("Something wrong!! Please contact to Admin");
                                })
                        }

                    })
            } catch (error) {
                reject(error);
            }
        })
    }
}
module.exports = new usersService;