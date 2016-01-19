var isvalid = require('isvalid');

var inputData = { user: "jacob", pass: "pwd", localction: [{ lat: 'aa', lon: 'bb' }], ptime:'2012-03-15T16:13:14'};

var schema = require('./schema.js');

isvalid(inputData, schema , function (err, validData) {
    /*
    err:       Error describing invalid data.
    validData: The validated data.
    */
});

