const CommonUtil = require("../../util/common");
const { isValidCode } = require("../../util/requestValidate");
const {
  insertFilterPresets,
  getFilterByTabName,
  getFilterByPresetName,
  getFillerQueryById,
} = require("../../util/sqlquery");
const mysql = require("../mysql");
class FilterBuilder {
  static async getAllFilters(req, res) {
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

  async getFilterQuery(queryParams) {
    const query = await mysql.query(getFillerQueryById, [queryParams]);
    if (!query || query.length === 0) {
      throw {
        code: 404,
        msg: "No Filter Preset found.",
      };
    }
    return query[0];
  }

  static async saveFilterPreset(req, res) {
    const { tabName, presetName, filterQuery, queryType } = req.body;

    try {
      FilterBuilder.validateFilterBody({
        tabName,
        presetName,
        filterQuery,
      });
      //checking id record with presetName is already present
      const result = await mysql.query(getFilterByPresetName, [
        tabName,
        req.loggedUser.userId,
        presetName,
      ]);
      //throw an error if preset already present.
      if (result && result.length > 0) {
        throw {
          code: 400,
          msg: "Filter by this presetName already present.",
        };
      }

      let convertedQuery = CommonUtil.convertQueryToMySqlQuery({
        tabName,
        filterQuery,
        queryType,
      });

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

  static validateFilterBody({ filterQuery, presetName, tabName }) {
    if (!filterQuery) {
      throw {
        code: 400,
        msg: "Filter Query not provided while inserting filter preset",
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
