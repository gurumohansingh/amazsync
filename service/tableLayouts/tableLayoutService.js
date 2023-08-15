const { isValidCode } = require("../../util/requestValidate");
const {
  getAllTableLayouts,
  insertTableLayout,
} = require("../../util/sqlquery");
const mysql = require("../mysql");

async function getAllLayouts(req, res) {
  const { tabName } = req.body;
  if (!tabName) {
    return res
      .status(400)
      .json({ success: false, error: "Tab Name is required." });
  }
  try {
    const layoutPresets = await mysql.query(getAllTableLayouts, [tabName]);
    if (!layoutPresets.length) {
      return res.send({ success: false }).status(204);
    }
    return res.status(200).json({ success: true, layouts: layoutPresets });
  } catch (err) {
    return res.status(isValidCode(err.code) ? err.code : 500).send({
      message: err.message || "Something went wrong while getting layouts.",
      success: false,
    });
  }
}

async function getSingleLayout(req, res) {}

async function saveLayout(req, res) {
  const { tabName, name, columns } = req.body;
  try {
    validateLayoutBody({ tabName, name, columns });
    const joinedColumn = columns.join(",");
    await mysql.query(insertTableLayout, [name, tabName, joinedColumn]);

    return res
      .status(200)
      .json({ success: true, message: "Layout created successfully." });
  } catch (error) {
    res.status(isValidCode(error.code) ? error.code : 500).send({
      message:
        error.message ||
        error.msg ||
        "Something went wrong while saving layouts.",
      success: false,
    });
  }
}

function validateLayoutBody({ tabName, name, columns }) {
  if (!name) {
    throw {
      code: 400,
      msg: "Layout Name not provided while inserting layouts.",
    };
  }

  if (!tabName) {
    throw {
      code: 400,
      msg: "Tab name not provided while inserting layouts.",
    };
  }

  if (!columns) {
    throw {
      code: 400,
      msg: "Columns array not provided while inserting layouts.",
    };
  }

  if (!columns.length) {
    throw {
      code: 400,
      msg: "Empty column array provided while inserting layouts.",
    };
  }
}
module.exports = {
  getAllLayouts,
  getSingleLayout,
  saveLayout,
};
