require('dotenv').config();

var express = require('express');
var cors = require('cors');
var parser = require('body-parser');
var geoip = require('geoip-lite');
var app = express();

app.use(cors());
app.use(parser.json());

var config = require('./servers');
var _ = require('lodash');

var checkService = require('./services/check-service');
var log = require('./logger');

var server = app.listen(process.env.PORT || 8081, "0.0.0.0", function () {
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

  var info = server.host + ':' + server.port;
  if(server.port2) info += ':' + server.port2;

  res.send(info);
  checkService.check(server);
});

app.get('/server-locs', function (req, res) {
  var locs = [];
  _.forEach(config.Servers, function(server) {
    var loc = geoip.lookup(server.host);
    loc.info = server;
    locs.push(loc);
  });

  res.send(locs);
});

app.get('/server-status', function (req, res) {
  if (!req.query.id) {
    res.status(400).send('400 Missing ID');
    return;
  }

  var server = _.find(config.Servers, { id: req.query.id });
  if (!server) {
    res.status(404).send('404 Couldn\'t find that server');
    return;
  }

  checkService.check(server).then(function(result) {
    res.send({isUp: result});
  });
});
