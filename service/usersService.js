const mysql = require('./mysql');
const { jwtNewToken } = require('./requestValidate');
const { compare, getIncrypt } = require('./security/bcrypt');
const { login, getUserByID } = require("../util/sqlquery");
class usersService {
    login = function (userName, password) {
        return new Promise((resolve, reject) => {
            mysql.query(login, [userName])
                .then(response => {
                    if (response.length > 0) {
                        compare(password, response[0]["password"])
                            .then((checkPassword) => {
                                if (checkPassword) {
                                    const token = jwtNewToken(userName, response[0].role);
                                    resolve({ token: token, roles: response[0].role, userName: response[0].firstname });
                                }
                                else { reject("Incorrect user name or password"); }
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
  findById(id) {
    return mysql.query(getUserByID, [id])
  }
}
module.exports = new usersService;