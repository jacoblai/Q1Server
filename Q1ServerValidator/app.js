var isvalid = require('isvalid');
var schema = require('./schema.js');
var inputData = { user: "jacob", pass: "pwd", localction1: [{ lat: '1.2255', lon: '128' }], ptime:'2012-03-15T16:13:14'};


isvalid(inputData, schema , function (err, validData) {
    console.log(JSON.stringify(validData));
});

