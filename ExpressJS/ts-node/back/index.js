"use strict";
exports.__esModule = true;
var express = require("express");
var app = express();
var prod = process.env.NODE_ENV === 'production';
app.set('port', prod ? process.env.PORT : 3065);
app.get('/', function (req, res) {
    res.send('성공!');
});
app.listen(app.get('port'), function () {
    console.log('서버 동작 중 🤖');
});
