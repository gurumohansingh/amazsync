var express = require('express');
var router = express.Router();
var admnService = require('../service/admn/admnService');
/* GET all user. */

router.get('/getallusers', (req, res, next) => {

  admnService.getAllUsers()
    .then((users) => {
      res.json(users);
    })
    .catch((error) => {
      res.status(500).send(error);
    })
})

router.post('/enabledisableuser', (req, res, next) => {
  var params = [req.body.status, req.body.Id];
  admnService.enabledisableuser(params)
    .then((users) => {
      res.json(users);
    })
    .catch((error) => {
      res.status(500).send(error);
    })
})

router.get('/getroles', (req, res, next) => {
  admnService.getRoles()
    .then((roles) => {
      res.json(roles);
    })
    .catch((error) => {
      res.status(500).send(error);
    })
})

router.post('/updaterole', (req, res, next) => {
  var params = [
    Array.isArray(req.body.roles) ? req.body.roles.join() : req.body.roles,
    req.body.email
  ];
  admnService.updateRoles(params)
    .then((roles) => {
      res.json(roles);
    })
    .catch((error) => {
      res.status(500).send(error);
    })
})

router.delete('/deleteUser', (req, res, next) => {
  var params = [req.body.Id];
  admnService.deleteUser(params)
    .then((users) => {
      res.json(users);
    })
    .catch((error) => {
      res.status(500).send(error);
    })
})

module.exports = router;
