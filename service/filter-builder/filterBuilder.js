const { isValidCode } = require("../../util/requestValidate");
const { insertFilterPresets } = require("../../util/sqlquery");
const log = require("../log");
const usersService = require("../usersService");
const mysql = require('../mysql');
class FilterBuilder {
  static async saveFilterPreset(req, res) {
    const filterPreset = req.body || {};
    try {
      FilterBuilder.validateFilterBody(filterPreset);
      const queryParams = [];
      if (filterPreset.userId) {

        const user = await usersService.findById(filterPreset.userId);
        
        log.info(user);
        if (!Array.isArray(user) || !user.length) {
          throw {
            code: 400,
            msg: "User doesn't exist"
          }
        }

        queryParams.push(filterPreset.userId)
      }

      if (filterPreset.filterQuery) {
        queryParams.push(filterPreset.filterQuery)
      }

      if (filterPreset.tabName) {
        queryParams.push(filterPreset.tabName)
      }

      queryParams.push(filterPreset.presetName)

      await mysql.query(insertFilterPresets, [queryParams])

      res.send({ message: "Filter saved successfully."})
    } catch (error) {
      log.error("saveFilterPreset:: error while saving filter", error);

      res.status(isValidCode(error.code) ? error.code : 500).send({
        message: error.msg || "Something went wrong while saving filter",
        success: false,
      });
    }
  }

  static validateFilterBody({ userId, filterQuery, tabName }) {
    if (!userId) {
      throw {
        code: 400,
        msg: "User details missing while inserting filter preset",
      };
    }

    if (!filterQuery) {
      throw {
        code: 400,
        msg: "Filter Query not provided while inserting filter preset",
      };
    }

    if (!tabName) {
      throw {
        code: 400,
        msg: "Tab name not provided while inserting filter preset",
      };
    }
  }

  
}

module.exports = FilterBuilder;
