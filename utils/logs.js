const moment = require('moment')

function formatLog(username, text){
  var log = "[" + moment().format('MMM D,YYYY kk:mm:ss') + "] $" + username + ": " +text+"\n"
  return log
}
module.exports = formatLog
