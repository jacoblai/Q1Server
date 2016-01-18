var fs = require('fs');
var tv4 = require('tv4');
var pt = __dirname + "\\document.json";
var schema = JSON.parse(fs.readFileSync(pt, 'utf8'));
var data1 = {
    users: [
        { id: 1, username: "davidwalsh", numPosts: 404, realName: "David Walsh" },
        { id: 2, username: "russianprince", numPosts: 12, realName: "Andrei Arshavin" }
    ]
};
var data2 = [true, 123];

console.log("data 1: " + tv4.validate(data1, schema)); // true
console.log("data 2: " + tv4.validate(data2, schema)); // false
//console.log("data 2 error: " + JSON.stringify(tv4.error, null, 4));