var checker = require("service-checker")();
var bot = require('../bot');
var _ = require('lodash');
var timeService = require('./time-service');
var log = require('../logger');

exports.check = function (server) {
    log.info('Checking %s:%s...', server.host, server.port);

    var opts = {
        host: server.host,
        port: server.port
    };

    checker.rawTcp(opts)
        .then(function (result) {
            if (result.success) {
                log.info('%s is up', server.host);
            } else {
                log.info('%s is down', server.host);

                // see if we can post a status
                if(timeService.canPostStatus()) {
                    log.info('Attempting to post a status...');
                    bot.status(server);
                } else {
                    log.error('Too soon to post a status\n');
                }
            }
        })
        .catch(function (err) {
            throw new Error(err);
        });
};