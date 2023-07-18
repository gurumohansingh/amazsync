const { convertQueryToMySqlQuery } = require("../../util/common");
const { isValidCode } = require("../../util/requestValidate");
const {
  insertFilterPresets,
  getFilterByTabName,
} = require("../../util/sqlquery");
const mysql = require("../mysql");
class FilterBuilder {
  static async getFilters(req, res) {
    const { tabName } = req.body;

    if (!tabName) {
      return res.status(400).json({ error: "Tab Name is required." });
    }
    try {
      const result = await mysql.query(getFilterByTabName, [
        tabName,
        req.loggedUser.userId,
      ]);

      res.status(200).json({ filters: result });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async saveFilterPreset(req, res) {
    const { tabName, presetName, tableName, filterQuery } = req.body;

    try {
      FilterBuilder.validateFilterBody({
        tabName,
        presetName,
        tableName,
        filterQuery,
      });
      let convertedQuery = convertQueryToMySqlQuery(tableName, filterQuery);

      const queryParams = [];
      if (req.loggedUser.userId) {
        queryParams.push(
          req.loggedUser.userId,
          convertedQuery,
          tabName,
          presetName
        );
      }

      await mysql.query(insertFilterPresets, [queryParams]);

      res.send({ message: "Filter saved successfully." });
    } catch (error) {
      res.status(isValidCode(error.code) ? error.code : 500).send({
        message: error.msg || "Something went wrong while saving filter",
        success: false,
      });
    }
  }

  static validateFilterBody({ filterQuery, presetName, tabName, tableName }) {
    if (!filterQuery) {
      throw {
        code: 400,
        msg: "Filter Query not provided while inserting filter preset",
      };
    }
    if (!tableName) {
      throw {
        code: 400,
        msg: "Table Name not provided while inserting filter preset",
      };
    }
    if (!presetName) {
      throw {
        code: 400,
        msg: "Preset Name not provided while inserting filter preset",
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
