const mongoose = require('mongoose');
const config = require('config');
// if('test' === process.env.NODE_ENV){
//     const host = config.get("mongodb.testing_host"); 
// }
// else {
//     const host = config.get("mongodb.host");
// }

async function connect() {
    try {
        const host = ('test' === process.env.NODE_ENV) ? config.get("mongodb.testing_host") : config.get("mongodb.host"); 
        await mongoose.connect(host, {useNewUrlParser: true, useUnifiedTopology: true});
        console.log('Connect successfully');
    } catch(error) {
        console.log('Connect fail');
    }
}

module.exports = { connect }