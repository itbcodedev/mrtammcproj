var express = require('express');
var router = express.Router();
var Alert = require('../models/alert');
const requestIp = require('request-ip');

router.post('/',  (req,res,next) => {
  var alert = new Alert({
    type: req.body.type,
    source: req.body.source,
    ipaddr: requestIp.getClientIp(req),
    summary: req.body.summary,
    description: req.body.description,
    status: req.body.status,
    priority: req.body.priority,
    level: req.body.level,
    create_on: Date.now(),
    owner_by: req.body.owner_by
  });

  alert.save((err, alert) => {
    if (err) {
      return next(err);
    }
    const message = {
      message: "Alerts create success fully",
      data: alert
    }
    res.status(201).json(message)
  });
});

router.get('/', (req,res,next) => {
  Alert.find({}).sort({create_on: -1}).exec( (err, alerts) => {
    return res.status(200).json(alerts);
  });
});


module.exports = router;
