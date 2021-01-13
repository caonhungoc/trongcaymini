const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        require: true,
        type: String
    },
    password: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    phoneNumber: {
        type: String
    },
    device: {
        type:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Device"
            }
        ],
        default: []
    },
    userType: {
        type: String,
        default: 'standard'
    }
})

const User = mongoose.model('User', userSchema);

module.exports = User;