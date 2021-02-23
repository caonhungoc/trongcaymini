const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const config = require('config');

const User = require('../models/user');
const Device = require('../models/device');
const Crop = require('../models/crop');

const secretKey = config.get('secretKey');

const postCreateDevice = async (req, res) => {

    let allowCreate = false;

    try {
        // check type of user
        const foundUser = await User.findById(req.user.id);

        // check number of device this user have
        if(foundUser.userType === 2 && foundUser.numberOfDevice < foundUser.userType) { // maximum of standard user is 2 device
            allowCreate = true;
        } 
        else if(foundUser === 'gold') { // gold user have unlimitted device
            allowCreate = true;
        }

        if(allowCreate) {
            const newDevice = new Device({
                deviceName: req.body.deviceName,
                userId: req.user.id
            })
            // add device
            await newDevice.save();
            // add new device to user model
            foundUser.device.push(newDevice._id);
            foundUser.numberOfDevice += 1;

            await foundUser.save();
            return res.status(200).send({messsage : "Create successfully."});
        }

        res.status(200).send({message: "Need to upgrade your role to create more device!"});
    }
    catch(e) {
        console.log(e);
        res.status(401).send({ message : "Error happen" });
    }
    
}

const postLogin = (req, res) => {
    const {email, password} = req.body;

    if(!email || !password) return res.status(401).send({mes: "Something went wrong!"});

    User.findOne({email: email})
    .then(user => {
        if(!user) return res.status(401).send({email: "Email not exist!"});

        bcrypt.compare(password, user.password)
        .then(isMatch => {
            if(!isMatch) res.status(401).send({password: "Password not correct!"})
            else {
                const payload = {
                    id: user._id,
                    email: user.email,
                    name: user.name
                }
                jwt.sign(payload, secretKey, {expiresIn: '24h' }, (err, token) => {
                    res.status(200).send({
                        id: user._id,
                        success: true,
                        token: `Bearer ${token}`
                    })
                })
           }
       })
    })
}

const postRegister = (req, res) => {
    const {name, email, userType, password, phoneNumber} = req.body;
    const errors = {};
    User.find({$or: [{email}]})
    .then(users => {
        if(users.length > 0) {
            for(let i = 0; i < users.length; i++) {
                if(users[i].email === email) errors.email = "Email already exist";
            }
            return res.status(409).send(errors);
        }
        else {
            const newUser = new User({name, email, userType, password, phoneNumber});

            // hash password with salt
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (error, hash) => {
                    if(error) throw error;
                    newUser.password = hash;
                    newUser.save()
                    .then(user => {
                        res.status(200).jsonp({mes : `Account created with username = ${user.name}, email = ${user.email}`});
                    })
                    .catch(console.log)
                })
            })
        }
    })
    .catch(console.log);
}

const getDevice = async (req, res) => {
    try {
        const foundDevice = await Device.find({userId: req.user.id})
        .populate("crop", "name startDate endDate typeOfPlant diary");
        res.status(200).send({foundDevice});
    }
    catch(e) {
        console.log(e);
        res.status(500).send({ message : "Error happen" });
    }
    
}

const getOpenCrop = async (req, res) => {
    const { deviceId } = req.body;
    try {
        const foundCrop = await Crop.find({deviceId, endDate: ''});
        res.status(200).jsonp({foundCrop});
    }
    catch(e) {
        console.log(e);
        res.status(500).jsonp({ message : "Error happen" });
    }
    
}


module.exports = {
    postCreateDevice,
    postLogin,
    postRegister,
    getDevice,
    getOpenCrop
}