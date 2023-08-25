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
      .then((result) => {
        res.json({ token: result.token, userRoles: result.roles, userName: result.userName });
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
    .then((roles) => {
      res.json(roles);
    })
    .catch((error) => {
      res.status(401).send(error);
    })
})
router.post('/register',usersService.registerUser)

router.post('/logout', (req, res, next) => {
  const token = req.headers["authorization"];
  req.session.destroy();
  res.send();
});
module.exports = router;
