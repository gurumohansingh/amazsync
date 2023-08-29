const mysql = require('../../service/mysql'),
    { updateSetting, addSetting, getSetting } = require('../../util/sqlquery'),
    format = require('string-format');
const constant = require("../../util/constant");

class sellerSettings {
    getSetting = function (userName, group) {
        return new Promise((resolve, reject) => {
            mysql.query(getSetting, [group])
                .then(settings => resolve(settings))
                .catch(err => reject(err));
        })
    }
    updateSetting = function (username, setting, group) {
        return new Promise((resolve, reject) => {
            mysql.query(updateSetting, [JSON.stringify(setting), group])
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

    async getSellerId(user) {
        var config = await this.getSetting(user, constant.SELLERSETTINGGROUP);
        return new Promise((resolve, reject) => {
            if (config && config.length > 0 && config[0].settings) {
                resolve(JSON.parse(config[0].settings));
            }
            else {
                reject();
            }
        }
        )
    }
}
module.exports = new sellerSettings;