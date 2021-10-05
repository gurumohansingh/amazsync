var log4js = require('log4js');
log4js.configure({
  appenders: {
    log: { type: 'file', filename: 'log/log.log' }
  },
  categories: {
    default: { appenders: ['log'], level: 'debug' }
  }
});
module.exports = {
  info: ((...msg) => {
    var loggerinfo = log4js.getLogger('log');
    loggerinfo.info(...msg)
  }),
  error: ((...err) => {
    var loggererror = log4js.getLogger('log');
    loggererror.error(...err);
  }),
  debug: ((...debug) => {
    var loggerdebug = log4js.getLogger('log');
    loggerdebug.debug(...debug)
  })
}