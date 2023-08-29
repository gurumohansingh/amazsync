const mysql = require("./mysql");
const { jwtNewToken } = require("./requestValidate");
const { compare, getIncrypt } = require("./security/bcrypt");
const {
  login,
  getUserByID,
  getUserByEmail,
  saveNewUser,
} = require("../util/sqlquery");
class usersService {
  login = function (userName, password) {
    return new Promise((resolve, reject) => {
      mysql
        .query(login, [userName])
        .then((response) => {
          if (response.length > 0) {
            compare(password, response[0]["password"])
              .then((checkPassword) => {
                if (checkPassword) {
                  const token = jwtNewToken(userName, response[0].role);
                  resolve({
                    token: token,
                    roles: response[0].role,
                    userName: response[0].firstname,
                  });
                } else {
                  reject("Incorrect user name or password");
                }
              })
              .catch((error) => {
                reject("Incorrect user name or password");
              });
          } else {
            reject("Incorrect user name or password");
          }
        })
        .catch((error) => {
          reject("Incorrect user name or password");
        });
    });
  };
  async registerUser(req, res, next) {
    let {
      email,
      firstname,
      middlename,
      lastname,
      password,
      confirmPassword,
      role = ["Product View"],
    } = req.body;
    try {
      //validation data
      validateRegisterBody({ email, firstname, password, confirmPassword });
      //encrypt password
      password = await getIncrypt(password);
      role = Array.isArray(role) && role.length ? role.join(",") : role;
      email = email.trim();
      //check if user with this email already exists.
      const exitingUser = await mysql.query(getUserByEmail, [email]);
      if (exitingUser.length) {
        //throw error if user already exists.
        throw { customErr: `User with ${email} already exist.` };
      } else {
        //create new user.
        await mysql.query(saveNewUser, {
          email,
          firstname,
          middlename,
          lastname,
          password,
          role,
          lastUpdated: new Date(),
        });
        return res.status(200).send("created");
      }
    } catch (error) {
      return res
        .status(400)
        .send(error.customErr || "Something wrong!! Please contact to Admin.");
    }
  }
  findById(id) {
    return mysql.query(getUserByID, [id]);
  }
}
module.exports = new usersService();

function validateRegisterBody({ email, firstname, password, confirmPassword }) {
  const error = [];
  if (!password) {
    error.push("Password can't be empty.");
  }
  if (!confirmPassword) {
    error.push("Confirm Password can't be empty.");
  }
  if (password != confirmPassword) {
    error.push("Password and confirm password should be same");
  }
  if (!firstname) {
    error.push("First name can't be empty");
  }
  if (!email) {
    error.push("Email name can't be empty");
  }
  if (error.length) {
    throw { customErr: error };
  }
}
