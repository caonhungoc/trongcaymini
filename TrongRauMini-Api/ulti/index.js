const mongoose = require('mongoose');
const config = require('config');
const host = config.get("mongodb.host");

async function connect() {
    try {
        await mongoose.connect(host, {useNewUrlParser: true, useUnifiedTopology: true});
        console.log('Connect successfully');
    } catch(error) {
        console.log('Connect fail');
    }
}

module.exports = { connect }