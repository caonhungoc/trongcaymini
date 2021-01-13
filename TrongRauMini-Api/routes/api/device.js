const express = require('express');
const devices = express.Router();

devices.use(function(req, res, next){ // middleware checking access permission
    console.log(req.body.pass);
    if(req.body.name != "ngoc" || req.body.pass != "caonhungoc") {
        res.send('Can\'t access!!');
    } else {
        next();
    }
})

devices.post('/insert-data', function(req, res){
	res.jsonp({name : "insert data api"});
})

module.exports = devices;