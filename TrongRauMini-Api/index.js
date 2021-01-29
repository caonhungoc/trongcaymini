const express = require('express');
// const morgan = require('morgan');
const config = require('config');
const userRoute = require('./routes/api/user');
const db = require('./ulti');
const deviceRoute = require('./routes/api/device');
const controlRoute = require('./routes/api/control');
const cropRoute = require('./routes/api/crop');
const passport = require('passport');

// Connect to db
db.connect();

const app = express();

const host = config.get("server.host");
const port = process.env.PORT || config.get("server.port");

//app.use(morgan("combined"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(passport.initialize());
require('./config/passport')(passport);

app.use("/user", userRoute);
app.use("/device", deviceRoute);
app.use("/crop", cropRoute);

app.use("/control", passport.authenticate('jwt', {session: false}), controlRoute);

app.listen(port, host, () => {
    console.log(`Server is listenning at port ${port}`);
})