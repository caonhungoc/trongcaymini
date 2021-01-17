const mongoose = require('mongoose');

const diarySchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now()
    },
    content: {
        type: String,
    },
    cropId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Crop"
    }
})

const Diary = new mongoose.model("Diary", diarySchema);

module.exports = Diary;