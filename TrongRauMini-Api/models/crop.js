const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
    name: { 
        type: String
    },
    startDate: {
        type: Date,
        default: Date.now()
    },
    endDate: {
        type: Date,
        default: ''
    },
    nameOfPlant: {
        type: String
    },
    diary: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Diary"
        }],
        default: []
    },
    log: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Log"
            }
        ],
        default: []
    },
    deviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Device"
    }
})

const Crop = new mongoose.model("Crop", cropSchema);

module.exports = Crop;