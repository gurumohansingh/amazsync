const { isValidCode } = require("../../util/requestValidate");
const {
  getAllTableLayouts,
  insertTableLayout,
  getLayoutByName,
  getOneLayout,
} = require("../../util/sqlquery");
const mysql = require("../mysql");

//Get all layouts.
async function getAllLayouts(req, res) {
  const { tabName } = req.body;
  //if tabName is not sent in request then throw and error.
  if (!tabName) {
    return res
      .status(400)
      .json({ success: false, error: "Tab Name is required." });
  }
  try {
    //get all layouts from database.
    const layoutPresets = await mysql.query(getAllTableLayouts, [
      tabName,
      req.loggedUser.userId,
    ]);
    //seperate column names in layoutPresets.
    const tablePresets = layoutPresets.map((layout) => {
      return {
        ...layout,
        columnNames: layout.columnNames.split(","),
      };
    });
    //Send data in response.

    return res.status(200).json({ success: true, layouts: tablePresets });
  } catch (err) {
    return res.status(isValidCode(err.code) ? err.code : 500).send({
      message: err.message || "Something went wrong while getting layouts.",
      success: false,
    });
  }
}

//get a single layout.
async function getSingleLayout(req, res) {
  const { id } = req.params;
  try {
    //get layout from database.
    const layout = await mysql.query(getOneLayout, [id, req.loggedUser.userId]);
    //convert the columnNames into an array using split method.
    const column = layout[0].columnNames.split(",");
    //Send the response.
    return res.status(200).json({ success: true, column });
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

//Save new layouts.
async function saveLayout(req, res) {
  const { tabName, name, columns } = req.body;
  try {
    //Validating the fields provided.
    validateLayoutBody({ tabName, name, columns });
    const queryParams = [name, tabName, req.loggedUser.userId];
    //checking if the layout already exists with this name.
    const result = await mysql.query(getLayoutByName, [...queryParams]);
    //if layout exists then throw an error.
    if (result.length) {
      throw {
        code: 409,
        msg: "Layout already exists with this name.",
      };
    }
    queryParams.push(columns.join(","));
    //otherwise attempt to save to Database.
    await mysql.query(insertTableLayout, [queryParams]);
    //if successfully send a response to user.
    return res
      .status(201)
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
