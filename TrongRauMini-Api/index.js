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

// app.use("/control", passport.authenticate('jwt', {session: false}), controlRoute);

app.listen(port, host, () => {
    console.log(`Server is listenning at port ${port}`);
})



// // Configuration parameters for server TCP handling ESP32 connection
// const tcpPort = config.get("server.tcpPort");

// const { createServer } = require('net');

// const server = createServer();

// server.on('connection', socket => {
//     socket.setKeepAlive(true, 10000);
//     socket.id = counter++;

//     console.log('client has connected')
//     socket.write('Please enter your name: ')

//     socket.on('data', data => {
//         if (!sockets[socket.id]) {
//             socket.deviceId = data.toString().trim();
//             socket.write(`Welcome ${socket.deviceId}!\n`);
//             sockets[socket.id] = socket;
//             return;
//         }
//         Object.entries(sockets).forEach(([key, sc]) => {
//             console.log(`${socket.id}: ${data}`)
//             if (key != socket.id) {
//                 sc.write(`${socket.deviceId}: `);
//                 sc.write(data);
//             }
//         })
//     });
//     socket.setEncoding('utf8');

//     socket.on('close', function (error) {
//         delete sockets[socket.id];
//         Object.entries(sockets).forEach(([keys, sc]) => {
//             sc.write(`${socket.deviceId}: `);
//             sc.write('has disconnected\n');
//         })
//         console.log(`${socket.deviceId} has disconnected`)
//         if (error) {
//             console.log('on close ', error);
//         }
//     });

//     socket.on('error', function (error) {

//         if (error) {
//             console.log('on error ', error);
//         }
//     });

// })

// server.listen(tcpPort, () => console.log('Server started'));