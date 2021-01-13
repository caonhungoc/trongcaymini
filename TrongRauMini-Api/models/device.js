const mongoose = require('mongoose');
const { modelName } = require('./user');

const deviceSchema = new mongoose.Schema({
    deviceName: { // use to address owner of this node
        type: String,
        require: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    crop: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Crop"
            }
        ],
        default: []
    }
})

const Device = mongoose.model("Device", deviceSchema);

module.exports = Device;