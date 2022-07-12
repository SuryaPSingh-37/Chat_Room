const moment = require('moment');
function formatMessage(user, message){
    return{
        username: user,
        message,
        time: moment().format('h:mm a')
    }
}

module.exports = formatMessage;