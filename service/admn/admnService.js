const mysql = require("../mysql"),
    { allUsers, enableDisableUser, getRoles, updateRoles ,deleteUser} = require("../../util/sqlquery");

class admnService {
    getAllUsers() {
        return new Promise((resolve, reject) => {
            mysql.query(allUsers, null)
                .then(users => resolve(users))
                .catch(err => reject(err));
        })
    }

    enabledisableuser(userId) {
        return new Promise((resolve, reject) => {
            mysql.query(enableDisableUser, userId)
                .then(users => resolve(users))
                .catch(err => reject(err));
        })
    }

    getRoles() {

        return new Promise((resolve, reject) => {

            mysql.query(getRoles, null)
                .then(roles => resolve(roles))
                .catch(err => reject(err));
        })
    }
    updateRoles(params) {

        return new Promise((resolve, reject) => {
            mysql.query(updateRoles, params)
                .then(roles => resolve(roles))
                .catch(err => reject(err));
        })
    }

    deleteUser(userId) {
        return new Promise((resolve, reject) => {
            mysql.query(deleteUser, userId)
                .then(users => resolve(users))
                .catch(err => reject(err));
        })
    }
}
module.exports = new admnService;
