var isvalid = require('isvalid');

var inputData = { user: "jacob", pass: "pwd", localction: [{ lat: '1.2255', lon: '128' }], ptime:'2012-03-15T16:13:14'};
var schema = require('./schema.js');

isvalid(inputData, schema , function (err, validData) {
    console.log(JSON.stringify(validData));
});

