const express = require('express');
const controlRouter = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const config = require('config');

const User = require('../../models/user');
const Device = require('../../models/device');
const Crop = require('../../models/crop');

const secretKey = config.get('secretKey');

let {sockets} = require('../../ulti/tcp-server'); // control by using this socket

controlRouter.post('/', passport.authenticate('jwt', {session: false}), 
async (req, res) => {
    // 4 relays ===> Control (relay 1|2|3|4 with value  0|1)
    let {relay, state, cropId} = req.body;

    // check that is  this crop legal because it can be closed?
    const foundCrop = await Crop.findOne({_id: cropId});

    if(!foundCrop) return res.status(400).jsonp({message: "Crop not exist!"});
    if(!foundCrop.endDate) return res.status(401).jsonp({message: "Crop have been closed!"});

    // find id of device have this crop
    let foundSocket;
    Object.entries(sockets).forEach(([key, sc]) => {
        console.log(`${socket.id}: ${data}`);
        if (sc.deviceId === foundCrop.id) {
            foundSocket = sc;
            // break;
        }
    })

    // find socket in sockets have this device
    if(!foundSocket) return res.status(500).jsonp({message: "Can not do this action!"});

    // send control signal to esp32
    await foundSocket.write(`control:${relay},${state}`);

    // get result feedback from esp32


    // send result for front-end

    res.status(200).send({message: "OK"});
})


controlRouter.get('/', passport.authenticate('jwt', {session: false}),
async (req, res) => {
    // temp + humid soil, 2 water level sensor
    const {cropId} = req.query;

    let sockets = res.locals.sockets;

    res.status(200).send({message: "OK"});
})

module.exports = controlRouter;