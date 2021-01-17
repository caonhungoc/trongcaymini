const express = require('express');
// const morgan = require('morgan');
const config = require('config');
// const userRoute = require('./routes/api/user');
// const db = require('./ulti');
// const deviceRoute = require('./routes/api/device');
// const controlRoute = require('./routes/api/control');
// const cropRoute = require('./routes/api/crop');
// const passport = require('passport');

// Configuration parameters for server TCP handling ESP32 connection
const tcpPort = config.get("server.tcpPort");

let counter = 0;
let sockets = {} // contain socket id of each device, each of  device have only 1 socket/time

const { createServer } = require('net');

const server = createServer();

server.on('connection', socket => {
    socket.setKeepAlive(true, 10000);
    socket.id = counter++;

    console.log('client has connected')
    socket.write('Please enter your name: ')

    socket.on('data', data => {
        if (!sockets[socket.id]) {
            socket.deviceId = data.toString().trim();
            socket.connectTime = new Date();
            socket.write(`Welcome ${socket.deviceId}!\n`);
            sockets[socket.id] = socket;

            let countSocket = [], i = 0;
            Object.entries(sockets).forEach(([key, sc]) => {
                console.log(`${socket.id}: ${data}`)
                if (socket.deviceId === sc.deviceId) {
                    countSocket[i++]  = sc;
                    if(i == 2) {
                        if(countSocket[0].connectTime.getTime() < countSocket[1].connectTime.getTime()) {
                            countSocket[0].destroy();
                            delete sockets[countSocket[0].id];
                            console.log('close old connection!');
                        }
                    }
                }
            })

            return;
        }

        Object.entries(sockets).forEach(([key, sc]) => {
            
            if (socket.deviceId === sc.deviceId) {
                console.log(`${socket.id}: ${data}`)
                sc.write(`${socket.deviceId}: `);
                sc.write(data);
            }
        })
    });
    socket.setEncoding('utf8');

    socket.on('close', function (error) {
        delete sockets[socket.id];
        Object.entries(sockets).forEach(([keys, sc]) => {
            sc.write(`${socket.deviceId}: `);
            sc.write('has disconnected\n');
        })
        console.log(`${socket.deviceId} has disconnected`)
        if (error) {
            console.log('on close ', error);
        }
    });

    socket.on('error', function (error) {

        if (error) {
            console.log('on error ', error);
        }
    });

})

server.listen(tcpPort, () => console.log('Server started'));

module.exports = {sockets}