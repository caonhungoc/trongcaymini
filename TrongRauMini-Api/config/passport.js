const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('config');

const User = require('../models/user');

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.get('secretKey');

module.exports = (passport) => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        User.findOne({_id: jwt_payload.id}, (err, res) => {
            if (err) {
                return done(err, false);
            }
            if (res) {
                return done(null, jwt_payload);
            } else {
                return done(null, false);
                // or you could create a new account
            }
        });
        // try {
        //     const res = await User.findOne().and([ {_id: jwt_payload.id}, {email: jwt_payload.email} ]);
        //     return done(null, jwt_payload);
        // }
        // catch(e) {
        //     console.log(e);
        //     return done(err, false);
        // }

    }));
}