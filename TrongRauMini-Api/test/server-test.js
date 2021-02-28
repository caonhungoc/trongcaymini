process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require("mongoose");

const server = require('../index');
const User = require("../models/user");
const Device = require("../models/device");
const Crop = require("../models/crop");

const should = chai.should();
const expect = chai.expect;
chai.use(chaiHttp);

describe('Users', function () {

    User.collection.drop();
    Device.collection.drop();
    Crop.collection.drop();

    it('register new account on /user/register', function (done) {
        chai.request(server)
            .post('/user/register')
            .send({
                'name': 'ngoccao',
                'email': 'caonhungoc1996@gmail.com',
                'password': 'Pass1234',
                'phoneNumber': '0352713135'
            })
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.have.property('mes');
                done();
            })
    })

    it('should register new account fail because same email on /user/register', function (done) {
        chai.request(server)
            .post('/user/register')
            .send({
                'name': 'ngoccao',
                'email': 'caonhungoc1996@gmail.com',
                'password': 'Pass1234',
                'phoneNumber': '0352713135'
            })
            .end(function (err, res) {
                res.should.have.status(409);
                res.body.should.have.property('email');
                res.body.email.should.equal("Email already exist");
                done();
            })
    })


    it('should login successfully on /user/login POST', function (done) {
        chai.request(server)
            .post('/user/login')
            .send({
                'name': 'ngoccao',
                'email': 'caonhungoc1996@gmail.com',
                'password': 'Pass1234',
                'phoneNumber': '03527135'
            })
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('id');
                res.body.should.have.property('success');
                res.body.should.have.property('token');
                res.body.success.should.equal(true);
                done();
            });
    });

    it('should login fail because of wrong email on /user/login POST', function (done) {
        chai.request(server)
            .post('/user/login')
            .send({
                'email': 'caonhungoc199776@gmail.com',
                'password': 'Pass1234'
            })
            .end(function (err, res) {
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property('email');
                res.body.email.should.equal("Email not exist!");
                done();
            });
    });

    it('should login fail because of wrong password on /user/login POST', function (done) {
        chai.request(server)
            .post('/user/login')
            .send({
                'email': 'caonhungoc1996@gmail.com',
                'password': 'Pass123467890'
            })
            .end(function (err, res) {
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property('password');
                res.body.password.should.equal("Password not correct!");
                done();
            });
    });

    it('should login fail because of wrong email on /user/login POST', function (done) {
        chai.request(server)
            .post('/user/login')
            .send({
                'password': 'Pass1234'
            })
            .end(function (err, res) {
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property('mes');
                res.body.mes.should.equal("Something went wrong!");
                done();
            });
    });

    it('should login fail because of wrong password on /user/login POST', function (done) {
        chai.request(server)
            .post('/user/login')
            .send({
                'email': 'caonhungoc1996@gmail.com'
            })
            .end(function (err, res) {
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property('mes');
                res.body.mes.should.equal("Something went wrong!");
                done();
            });
    });

    it('should create device success on /user/create-device POST', function (done) {
        chai.request(server)
            .post('/user/login')
            .send({
                'email': 'caonhungoc1996@gmail.com',
                'password': 'Pass1234'
            })
            .end(function (err, res) {
                // get token
                res.should.have.status(200);
                res.body.should.have.property('token');

                let token = res.body.token;

                chai.request(server)
                    .post('/user/create-device')
                    .set('Authorization', token)
                    .end(function (err, res) {
                        res.should.have.status(200);
                        res.body.should.have.property('messsage');
                        res.body.messsage.should.equal('Create successfully.');
                    });
                done();
            });
    });

    it('should create device success on /user/create-device POST', function (done) {
        chai.request(server)
            .post('/user/login')
            .send({
                'email': 'caonhungoc1996@gmail.com',
                'password': 'Pass1234'
            })
            .end(function (err, res) {
                // get token
                res.should.have.status(200);
                res.body.should.have.property('token');

                let token = res.body.token;

                chai.request(server)
                    .post('/user/create-device')
                    .set('Authorization', token)
                    .end(function (err, res) {
                        res.should.have.status(200);
                        res.body.should.have.property('messsage');
                        res.body.messsage.should.equal('Create successfully.');
                    });
                done();
            });
    });

    it('should create device fail because of maimum device of normal user on /user/create-device POST', function (done) {
        chai.request(server)
            .post('/user/login')
            .send({
                'email': 'caonhungoc1996@gmail.com',
                'password': 'Pass1234'
            })
            .end(function (err, res) {
                // get token
                res.should.have.status(200);
                res.body.should.have.property('token');

                let token = res.body.token;

                chai.request(server)
                    .post('/user/create-device')
                    .set('Authorization', token)
                    .end(function (err, res) {
                        res.should.have.status(200);
                        res.body.should.have.property('message');
                        res.body.message.should.equal("Need to upgrade your role to create more device!");
                    });
                done();
            });
    });

    it('should get all device success on /user/create-crop POST', function (done) {
        chai.request(server)
            .post('/user/login')
            .send({
                'email': 'caonhungoc1996@gmail.com',
                'password': 'Pass1234'
            })
            .end(function (err, res) {
                // get token
                res.should.have.status(200);
                res.body.should.have.property('token');

                let token = res.body.token;
                // console.log(token)

                chai.request(server)
                    .get('/user/get-device')
                    .set('Authorization', token)
                    .end(function (err, res) {
                        // console.log(res.body);
                        res.body.should.have.property('foundDevice');
                        res.should.have.status(200);
                    });
                done();
            });
    });

    it('Should create crop success on /crop/create-crop POST', function (done) {
        chai.request(server)
            .post('/user/login')
            .send({
                'email': 'caonhungoc1996@gmail.com',
                'password': 'Pass1234'
            })
            .end(function (err, res) {
                // get token
                res.should.have.status(200);
                res.body.should.have.property('token');

                let token = res.body.token;
                // console.log(token)

                chai.request(server)
                    .get('/user/get-device')
                    .set('Authorization', token)
                    .end(function (err, res) {
                        //console.log(res.body);
                        res.body.should.have.property('foundDevice');
                        res.should.have.status(200);
                        // console.log('tokennn: ' + token);
                        // Create new Crop
                        chai.request(server)
                            .post('/crop/create-crop')
                            .set('Authorization', token)
                            .send({
                                deviceId: res.body.foundDevice[0]._id,
                                userId: res.body.foundDevice[0].userId,
                                name: "testing",
                                nameOfPlant: "testing"
                            })
                            .end(function (err, res) {
                                // console.log(res.body);
                                res.body.should.have.property('result');
                                res.should.have.status(200);
                            });

                    });
                done();
            });
    });

    it('Should create crop fail with device[0] on /crop/create-crop POST', function (done) {
        chai.request(server)
            .post('/user/login')
            .send({
                'email': 'caonhungoc1996@gmail.com',
                'password': 'Pass1234'
            })
            .end(function (err, res) {
                // get token
                res.should.have.status(200);
                res.body.should.have.property('token');

                let token = res.body.token;
                // console.log(token)

                chai.request(server)
                    .get('/user/get-device')
                    .set('Authorization', token)
                    .end(function (err, res) {
                        //console.log(res.body);
                        res.body.should.have.property('foundDevice');
                        res.should.have.status(200);
                        // console.log('tokennn: ' + token);
                        // Create new Crop
                        chai.request(server)
                            .post('/crop/create-crop')
                            .set('Authorization', token)
                            .send({
                                deviceId: res.body.foundDevice[0]._id,
                                userId: res.body.foundDevice[0].userId,
                                name: "testing",
                                nameOfPlant: "testing"
                            })
                            .end(function (err, res) {
                                // console.log(res.body);
                                // res.body.should.have.property('result');
                                res.should.have.status(402);
                            });
                    });
                done();
            });
    });

    it('Should create crop success on /crop/create-crop POST', function (done) {
        chai.request(server)
            .post('/user/login')
            .send({
                'email': 'caonhungoc1996@gmail.com',
                'password': 'Pass1234'
            })
            .end(function (err, res) {
                // get token
                res.should.have.status(200);
                res.body.should.have.property('token');

                let token = res.body.token;
                // console.log(token)

                chai.request(server)
                    .get('/user/get-device')
                    .set('Authorization', token)
                    .end(function (err, res) {
                        //console.log(res.body);
                        res.body.should.have.property('foundDevice');
                        res.should.have.status(200);
                        // console.log('tokennn: ' + token);
                        // Create new Crop
                        chai.request(server)
                            .post('/crop/create-crop')
                            .set('Authorization', token)
                            .send({
                                deviceId: res.body.foundDevice[1]._id,
                                userId: res.body.foundDevice[1].userId,
                                name: "testing",
                                nameOfPlant: "testing"
                            })
                            .end(function (err, res) {
                                // console.log(res.body);
                                res.body.should.have.property('result');
                                res.should.have.status(200);
                            });

                    });
                done();
            });
    });

    it('Should create crop fail with device[1] on /crop/create-crop POST', function (done) {
        chai.request(server)
            .post('/user/login')
            .send({
                'email': 'caonhungoc1996@gmail.com',
                'password': 'Pass1234'
            })
            .end(function (err, res) {
                // get token
                res.should.have.status(200);
                res.body.should.have.property('token');

                let token = res.body.token;
                // console.log(token)

                chai.request(server)
                    .get('/user/get-device')
                    .set('Authorization', token)
                    .end(function (err, res) {
                        //console.log(res.body);
                        res.body.should.have.property('foundDevice');
                        res.should.have.status(200);
                        // console.log('tokennn: ' + token);
                        // Create new Crop
                        chai.request(server)
                            .post('/crop/create-crop')
                            .set('Authorization', token)
                            .send({
                                deviceId: res.body.foundDevice[1]._id,
                                userId: res.body.foundDevice[1].userId,
                                name: "testing",
                                nameOfPlant: "testing"
                            })
                            .end(function (err, res) {
                                // console.log(res.body);
                                // res.body.should.have.property('result');
                                res.should.have.status(402);
                            });
                    });
                done();
            });
    });

    it('Should create add diary successfully on /crop/add-diary POST', function (done) {
        chai.request(server)
            .post('/user/login')
            .send({
                'email': 'caonhungoc1996@gmail.com',
                'password': 'Pass1234'
            })
            .end(function (err, res) {
                // get token
                res.should.have.status(200);
                res.body.should.have.property('token');

                let token = res.body.token;
                // console.log(token)

                chai.request(server)
                    .get('/user/get-device')
                    .set('Authorization', token)
                    .end(function (err, res) {
                        // console.log(res.body);
                        res.body.should.have.property('foundDevice');
                        res.should.have.status(200);
                        // console.log('tokennn: ' + token);
                        // Create new Crop
                        // console.log("nnnnn " + res.body.foundDevice[0]._id);
                        chai.request(server)
                            .get('/user/get-open-crop')
                            .set('Authorization', token)
                            .send({
                                deviceId: res.body.foundDevice[0]._id,
                            })
                            .end(function (err, res) {
                                // console.log(res.body);
                                // res.body.should.have.property('result');
                                res.should.have.status(200);
                                chai.request(server)
                                    .post('/crop/add-diary')
                                    .set('Authorization', token)
                                    .send({
                                        cropId: res.body.foundCrop[0]._id,
                                        content: "testing content"
                                    })
                                    .end(function (err, res) {
                                        // console.log(res.body);
                                        res.body.should.have.property("message");
                                        res.should.have.status(200);
                                        res.body.message.content.should.equal("testing content");
                                    });
                            });
                    });
                done();
            });
    });

});

// describe('Crop', function () {
//     // User.collection.drop();
//     // Device.collection.drop();
//     Crop.collection.drop();

//     it('Should create crop success on /crop/create-crop POST', function (done) {
//         chai.request(server)
//             .post('/user/login')
//             .send({
//                 'email': 'caonhungoc1996@gmail.com',
//                 'password': 'Pass1234'
//             })
//             .end(function (err, res) {
//                 // get token
//                 res.should.have.status(200);
//                 res.body.should.have.property('token');

//                 let token = res.body.token;
//                 // console.log(token)

//                 chai.request(server)
//                     .get('/user/get-device')
//                     .set('Authorization', token)
//                     .end(function (err, res) {
//                         console.log(res.body);
//                         res.body.should.have.property('foundDevice');
//                         res.should.have.status(200);

//                         // Create new Crop
//                         chai.request(server)
//                             .get('/crop/create-crop')
//                             .set('Authorization', token)
//                             .send({
//                                 deviceId: res.body._id, 
//                                 userId: res.body.userId, 
//                                 name: "testing", 
//                                 nameOfPlant: "testing"
//                             })
//                             .end(function (err, res) {
//                                 console.log(res.body);
//                                 // res.body.should.have.property('result');
//                                 res.should.have.status(200);
//                             });

//                     });
//                 done();
//             });
//     });

// });