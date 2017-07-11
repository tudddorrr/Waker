require('dotenv').config();

var express = require('express');
var cors = require('cors');
var parser = require('body-parser');
var app = express();

app.use(cors());
app.use(parser.json());

var config = require('./servers');
var _ = require('lodash');

var checkService = require('./services/check-service');
var log = require('./logger');

var server = app.listen(8000, "0.0.0.0", function () {
  var port = server.address().port;
  log.info("Waker listening on port %s\n", port);
});

app.get('/server', function (req, res) {
  if (!req.query.id) {
    res.status(400).send('400 Missing ID');
    return;
  }

  var server = _.find(config.Servers, { id: req.query.id });
  if (!server) {
    res.status(404).send('404 Couldn\'t find that server');
    return;
  }

  res.send(server.host + ':' + server.port);
  checkService.check(server);
});

