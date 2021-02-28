const express = require('express');
const controlRouter = express.Router();
const passport = require('passport');

const Control = require('../../controllers/control');

let {sockets} = require('../../ulti/tcp-server'); // control by using this socket

controlRouter.post('/', 
    passport.authenticate('jwt', {session: false}), 
    Control.postControl
)

controlRouter.get('/get-state', passport.authenticate('jwt', {session: false}),
    // temp + humid soil, 2 water level sensor, light sensor
    Control.getEspState
)

controlRouter.get('/', passport.authenticate('jwt', {session: false}),
async (req, res) => {
    // temp + humid soil, 2 water level sensor, light sensor
    res.status(200).send({message: sockets});
})

module.exports = controlRouter;