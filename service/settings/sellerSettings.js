const mysql = require('../../service/mysql'),
    { updateSetting, addSetting, getSetting } = require('../../util/sqlquery'),
    format = require('string-format');
class sellerSettings {
    getSetting = function (userName, group) {
        return new Promise((resolve, reject) => {
            mysql.query(getSetting, [userName, group])
                .then(settings => resolve(settings))
                .catch(err => reject(err));
        })
    }
    updateSetting = function (username, setting, group) {
        return new Promise((resolve, reject) => {
            mysql.query(updateSetting, [JSON.stringify(setting), username, group])
                .then(settings => resolve(settings))
                .catch(err => reject(err));
        })
    }
    addSetting = function (username, setting, group) {
        var newSetting = {
            settings: JSON.stringify(setting),
            username: username,
            settinggroup: group
        }
        return new Promise((resolve, reject) => {
            mysql.query(addSetting, newSetting)
                .then(settings => resolve(settings))
                .catch(err => reject(err));
        })
    }
}
module.exports = new sellerSettings;