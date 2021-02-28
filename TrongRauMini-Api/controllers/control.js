const express = require('express');
const controlRouter = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const config = require('config');

const User = require('../models/user');
const Device = require('../models/device');
const Crop = require('../models/crop');

let {sockets} = require('../ulti/tcp-server'); // control by using this socket

const postControl = async (req, res) => {
    // 4 relays ===> Control (relay 1|2|3|4 with value  0|1)
    let {relay, state, cropId} = req.body;

    try {
        // check that is  this crop legal because it can be closed?
        const foundCrop = await Crop.findById(cropId);

        if(!foundCrop) return res.status(400).send({message: "Crop not exist!"});
        if(foundCrop.endDate) return res.status(401).send({message: "Crop have been closed!"});

        // find id of device have this crop
        let foundSocket;
        Object.entries(sockets).forEach(([key, sc]) => {
            if (sc.deviceId === foundCrop.deviceId.toString()) {
                foundSocket = sc;
                // break;
            }
        })

        // find socket in sockets have this device
        if(!foundSocket) return res.status(500).send({message: "Can not do this action!"});

        // send control signal to esp32
        await foundSocket.write(`control:${relay},${state}}`);

        // get result feedback from esp32
        // while(!foundSocket.receivedData) {
        //     setTimeout(() => {
        //         if(false === foundSocket.receivedData) {
        //             foundSocket.receivedData = true; // can't receive feedback from esp32
        //             res.status(200).send({message: "OK " + foundSocket.espData});
        //         }
        //     }, 2000)
        // }

        // send result for front-end

        res.status(200).send({message: "OK "});
    }
    catch(e) {
        console.log(e);
        res.status(500).send({message: "error"});
    }
    
}

const getState = async (req, res) => {
    let {cropId} = req.body;
    try {
        // check that is  this crop legal because it can be closed?
        const foundCrop = await Crop.findById(cropId);

        if(!foundCrop) return res.status(400).send({message: "Crop not exist!"});
        if(foundCrop.endDate) return res.status(401).send({message: "Crop have been closed!"});

        // find id of device have this crop
        let foundSocket;
        Object.entries(sockets).forEach(([key, sc]) => {
            if (sc.deviceId === foundCrop.deviceId.toString()) {
                foundSocket = sc;
                // break;
            }
        })

        res.status(200).send({message: foundSocket.espData});
    }
    catch(e) {
        console.log(e);
        res.status(500).send({message: "error"});
    }
    
}

module.exports = {
    postControl,
    getState
};