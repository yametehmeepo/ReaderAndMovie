var express = require("express");
var app = express();
var request = require('request');
app.get("/*", (req, res, next) => {
    request('https://api.douban.com' + req.url, function (error, response, body) {
        res.send(body);
    });
})

app.listen(3000);