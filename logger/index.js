var log4js = require('log4js');

log4js.configure({
  appenders: {
    out: { type: 'stdout' },
    app: { type: 'file', filename: 'logger/waker.log' }
  },
  categories: {
    default: { appenders: [ 'out', 'app' ], level: 'All' }
  }
});

var logger = log4js.getLogger('All');

module.exports = logger;