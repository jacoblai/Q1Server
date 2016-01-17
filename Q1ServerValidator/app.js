var tv4 = require('tv4');
var schema = {
    "items": {
        "type": "boolean"
    }
};
var data1 = [true, false];
var data2 = [true, 123];

console.log("data 1: " + tv4.validate(data1, schema)); // true
console.log("data 2: " + tv4.validate(data2, schema)); // false
console.log("data 2 error: " + JSON.stringify(tv4.error, null, 4));