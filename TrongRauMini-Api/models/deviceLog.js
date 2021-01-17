const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    action: String,
    logDate: {
        type: Date,
        default: Date.now()
    },
    cropId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Crop"
    }
})

const Log = new mongoose.model("Log", logSchema);

module.exports = Log;