const {format} = require('timeago.js');


const helpers = {};

helpers.timeago = (timestamp) =>{
    return format(timestamp);
};

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [day, month, year].join('-');
}

helpers.todate = (timestamp) =>{
    return formatDate(timestamp)
}

module.exports = helpers;