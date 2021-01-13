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
    },
    typeOfPlant: {
        type: String
    },
    diary: {
        type: [{
            type: String
        }],
        default: []
    },
    log: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Crop"
            }
        ],
        default: []
    }
})