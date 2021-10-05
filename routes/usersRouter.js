var express = require('express');
var router = express.Router();
var usersService = require('../service/usersService');
const { validateTokenByToken } = require('../service/requestValidate');
var log = require('../service/log');
/* GET usersService listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

/**
 * login
 */
router.post('/login', (req, res, next) => {
  let { user, password } = req.body;
  password = req.body.password;
  let error = [];
  if (!user) {
    error.push("User name can't be empty");
  }
  if (!password) {
    error.push("Password can't be empty");
  }

  if (error.length == 0) {
    usersService.login(user, password)
      .then((token) => {
        res.json({ token: token });
      })
      .catch((error) => {
        res.status(400).send(error);
      })
  } else {
    res.status(400).send(error);
  }

})
router.get('/validateToken', (req, res, next) => {
  log.info(req.originalUrl, req.body)
  const token = req.headers["authorization"];
  if (!token) {
    res.sendStatus(401);
  }
  validateTokenByToken(token)
    .then(() => {
      res.json({ token: token });
    })
    .catch((error) => {
      res.status(401).send(error);
    })
})
router.post('/register', (req, res, next) => {

  let { email, firstname, password, confirmPassword } = req.body;
  let error = [];
  if (password != confirmPassword) {
    error.push("Password and confirm password should be same");
  }
  if (!firstname) {
    error.push("First name can't be empty");
  }
  if (!email) {
    error.push("Email name can't be empty");
  }

  if (error.length == 0) {
    usersService.registerUser({ email: email, firstname: firstname, password: password })
      .then((responce) => {
        res.send("created");
      })
      .catch((error) => {
        res.status(400).send(error);
      })
  } else {
    res.status(400).send(error);
  }
})

module.exports = router;
