const express = require('express');
const cropRouter = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const config = require('config');

const User = require('../../models/user');
const Device = require('../../models/device');
const Crop = require('../../models/crop');

const secretKey = config.get('secretKey');

cropRouter.post('/create-crop', passport.authenticate('jwt', {session: false}), 
async (req, res) => {
    const {deviceId, userId, name, nameOfPlant} = req.body;

    try {
        // check that does this device belong to user?
        const foundUser = await User.findOne()
        .and([{ "device": { $elemMatch: { $eq: deviceId } } }, {_id: userId}]);

        if(!foundUser) return res.status(401).jsonp({ message: "Can not create crop with this deivce1!" });
        
        // check that is this device used for another crop? 
        let foundDevice = await Device.findOne({ _id:  deviceId })
        if(foundDevice.inProgressOfCrop) return res.status(402).jsonp({ message: "Can not create crop with this device!" });

        // add crop
        const newCrop = new Crop({
            name,
            nameOfPlant,
            deviceId
        });

        await newCrop.save();

        // update status of device, add id of crop to device model
        foundDevice.inProgressOfCrop = true;
        foundDevice.crop.push(newCrop.id);

        await foundDevice.save();
        res.status(200).jsonp({ 
            result: "OK",
            data: newCrop
        })
    }
    catch(e) {
        console.log(e);
        res.status(401).jsonp({ message: "Error !" });
    }
})

cropRouter.post('/close-crop', passport.authenticate('jwt', {session: false}), 
async (req, res) => {
    const {cropId} = req.body;

    try {
        // find crop by crop's id
        const foundCrop = await Crop.findOne({_id: cropId})

        if(!foundCrop) return res.status(403).jsonp({ message: "Can not find this crop!" });
        
        // check that is this device used for another crop? 
        let foundDevice = await Device.findOne({ _id:  foundCrop.deviceId })

        // update status of device
        foundDevice.inProgressOfCrop = false;
        foundDevice.endDate = new Date();

        await foundDevice.save();
        res.status(200).jsonp({ 
            result: "Close Crop OK",
        })
    }
    catch(e) {
        console.log(e);
        res.status(401).jsonp({ message: "Error !" });
    }
})

module.exports = cropRouter;