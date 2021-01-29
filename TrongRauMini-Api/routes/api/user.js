const express = require('express');
const user_router = express.Router();

const passport = require('passport');

const User = require('../../controllers/user');

// api/user + /login ==> /api/user/login
// route: /api/user/login (POST)
// description:  login
// access: PUBLIC
user_router.post('/login', User.postLogin);

// api/user + /register ==> /api/user/register
// route: /api/user/register (POST)
// description:  register new account
// access: PUBLIC
user_router.post('/register', User.postRegister);

// api/user + /test-private ==> /api/user/test-private
// route: /api/user/test-private (GET)
// description:  test-private
// access: PRIVATE
user_router.get(
    '/test-private', 
    passport.authenticate('jwt', {session: false}), 
    (req, res) => {
        res.status(200).jsonp(req.user);
    }
);

// api/user + /create-device ==> /api/user/create-device
// route: /api/user/create-device (POST)
// description:  create device for user
// access: PRIVATE
user_router.post(
    '/create-device', 
    passport.authenticate('jwt', {session: false}), 
    User.postCreateDevice
);


// api/user + /get-device ==> /api/user/get-device
// route: /api/user/get-device (GET)
// description:  get all device this user have user
// access: PRIVATE
user_router.get(
    '/get-device', 
    passport.authenticate('jwt', {session: false}), 
    User.getDevice
);

// api/user + /get-open-crop ==> /api/user/get-open-crop
// route: /api/user/get-open-crop (GET)
// description:  get all open crop
// access: PRIVATE
user_router.get(
    '/get-open-crop', 
    passport.authenticate('jwt', {session: false}), 
    User.getOpenCrop
);

module.exports = user_router;