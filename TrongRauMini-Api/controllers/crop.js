const User = require('../models/user');
const Device = require('../models/device');
const Crop = require('../models/crop');
const Diary = require('../models/diary');

const postCreateCrop = async (req, res) => {
    const {deviceId, userId, name, nameOfPlant} = req.body;
    console.log(deviceId, userId, name, nameOfPlant);
    try {
        // check that does this device belong to user?
        const foundUser = await User.findOne()
        .and([{ "device": { $elemMatch: { $eq: deviceId } } }, {_id: userId}]);

        if(!foundUser) {
            return res.status(401).send({ message: "Can not create crop with this deivce1!" });
        }
        
        // check that is this device used for another crop? 
        let foundDevice = await Device.findOne({ _id:  deviceId })
        // console.log('abc ' + foundDevice.inProgressOfCrop);
        if(foundDevice.inProgressOfCrop) {
            return res.status(402).send({ message: "Can not create crop with this device!" });
        }
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
        res.status(200).send({ 
            result: "OK",
            data: newCrop
        })
    }
    catch(e) {
        console.log(e);
        res.status(401).send({ message: "Error !" });
    }
}

const postCloseCrop = async (req, res) => {
    const {cropId} = req.body;
    try {
        // find crop by crop's id
        const foundCrop = await Crop.findOne({_id: cropId})

        if(!foundCrop) return res.status(403).send({ message: "Can not find this crop!" });
        
        // check that is this device used for another crop? 
        let foundDevice = await Device.findOne({ _id:  foundCrop.deviceId })

        // update status of device
        foundDevice.inProgressOfCrop = false;
        foundDevice.endDate = new Date();

        await foundDevice.save();
        res.status(200).send({ 
            result: "Close Crop OK",
        })
    }
    catch(e) {
        console.log(e);
        res.status(401).send({ message: "Error !" });
    }
}

const postDiary = async (req, res) => { // transaction, will be inplemented later
    let {cropId, content} = req.body;
    try {
        // check that is  this crop legal because it can be closed?
        const foundCrop = await Crop.findById(cropId);

        if(!foundCrop) return res.status(400).send({message: "Crop not exist!"});
        if(foundCrop.endDate) return res.status(401).send({message: "Crop have been closed!"});

        // create diary
        const newDiary = new Diary({
            content: content,
            cropId: cropId
        })
        await newDiary.save();

        // add diary to crop
        foundCrop.diary.push(newDiary._id);
        await foundCrop.save();

        res.status(200).send({message: newDiary});
    }
    catch(e) {
        console.log(e);
        res.status(500).send({message: "error"});
    }
    
}

module.exports = {
    postCreateCrop,
    postCloseCrop,
    postDiary
}
