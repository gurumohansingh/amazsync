const mysql = require("../../service/mysql"),
  { updateSetting, addSetting, getSetting } = require("../../util/sqlquery"),
  format = require("string-format");
const constant = require("../../util/constant");
const { validate } = require('../../util/requestValidate' );

class sellerSettings {
  async getSetting(req, res, next) {
    const { settinggroup } = req.query;
    try {
      const result = await mysql.query(getSetting, [
        settinggroup,
        req.loggedUser.username,
      ]);
      if (result?.length) {
        return res.status(200).send(result[0]);
      } else {
        return res.status(404).send();
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }
  async addOrUpdateSetting(req, res, next) {
    const setting = req.body;
    //validating feilds if settinggroup is 'sellerSettingGroup'
    if (setting.settinggroup === "sellerSettingGroup") {
      validate(
        setting,
        [
          "SellerId",
          "MWSAuthToken",
          "AWSAccessKeyId",
          "ClientSecret",
          "MarketPalaceID",
        ],
        res
      );
      setting["settinggroup"] = constant.SELLERSETTINGGROUP;
    }
    try {
      //checking for existing setting.
      const result = await mysql.query(getSetting, [
        setting["settinggroup"],
        req.loggedUser.username,
      ]);
      if (result.length) {
        //update setting if exists.
        await mysql.query(updateSetting, [
          JSON.stringify(setting),
          setting["settinggroup"],
          req.loggedUser.username,
        ]);
        return res.status(200).send("Updated successfully.");
      } else {
        //add new setting
        const newSetting = {
          settings: JSON.stringify(setting),
          username: req.loggedUser.username,
          settinggroup: constant.SELLERSETTINGGROUP,
        };
        await mysql.query(addSetting, newSetting);
        return res.status(200).send("Setting added successfully.");
      }
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  }

  async getSellerId(user) {
    return new Promise((resolve, reject) => {
      mysql
        .query(getSetting, [constant.SELLERSETTINGGROUP, user])
        .then((settings) => {
          if (settings.length && settings[0].settings) {
            resolve(JSON.parse(settings[0].settings));
          } else {
            reject();
          }
        })
        .catch((err) => reject());
    });
  }
}
module.exports = new sellerSettings();
