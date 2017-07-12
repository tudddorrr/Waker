var moment = require('moment');
var lastStatus = require('../last-status');
var _ = require('lodash');
var fs = require('fs');

exports.now = function() {
    return moment().format('MMM Do YY, hh:mm a');
};

exports.setLastStatus = function(status) {
    _.set(lastStatus, 'status', status);
    _.set(lastStatus, 'time', moment());

    fs.writeFile('last-status.json', JSON.stringify(lastStatus), 'utf8');
};

exports.canPostStatus = function() {
    var now = moment().valueOf();
    var lastTime = moment(_.get(lastStatus, 'time')).valueOf();
    var diff = moment.duration(now-lastTime).asMinutes();

    var statusInterval = process.env.STATUS_INTERVAL || 30;
    return diff > statusInterval;
};