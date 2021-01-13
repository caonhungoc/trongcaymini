const express = require('express');
const user_router = express.Router();
const user = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const config = require('config');

const secretKey = config.get('secretKey');

// api/user + /search ==> /api/user/search
// route: /api/user/search (GET)
// description:  search an user in this system
// access: PRIVATE
user_router.get('/search', (req, res) => {
	res.jsonp({name : "search"});
});

// api/user + /login ==> /api/user/login
// route: /api/user/login (POST)
// description:  login
// access: PUBLIC
user_router.post('/login', (req, res) => {
    const {email, password} = req.body;
    user.findOne({email: email})
    .then(user => {
        if(!user) return res.status(404).jsonp({email: "Email not exist!"});

        bcrypt.compare(password, user.password)
        .then(isMatch => {
            if(!isMatch) res.status(400).jsonp({password: "Password not correct!"})
            else {
                const payload = {
                    id: user._id,
                    email: user.email,
                    name: user.name
                }
                jwt.sign(payload, secretKey, {expiresIn: '24h' }, (err, token) => {
                    res.status(200).jsonp({
                        success: true,
                        token: `Bearer ${token}`
                    })
                })
           }
       })
    })
});

// api/user + /register ==> /api/user/register
// route: /api/user/register (POST)
// description:  register new account
// access: PUBLIC
user_router.post('/register', (req, res) => {
    const {name, email, userType, password, phoneNumber} = req.body;
    const errors = {};
    user.find({$or: [{email}]})
    .then(users => {
        if(users.length > 0) {
            for(let i = 0; i < users.length; i++) {
                if(users[i].email === email) errors.email = "Email already exist";
            }
            return res.status(400).jsonp(errors);
        }
        else {
            const newUser = new user({name, email, userType, password, phoneNumber});

            // hash password with salt
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (error, hash) => {
                    if(error) throw error;
                    newUser.password = hash;
                    newUser.save()
                    .then(user => {
                        res.status(200).jsonp({mes : `Account created with username = ${user.name}, email = ${user.email}`});
                    })
                    .catch(console.log)
                })
            })
        }
    })
    .catch(console.log);
});

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

module.exports = user_router;