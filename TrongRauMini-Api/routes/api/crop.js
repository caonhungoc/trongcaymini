const express = require('express');
const cropRouter = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const config = require('config');

const Crop = require('../../controllers/crop')

const secretKey = config.get('secretKey');

cropRouter.post('/create-crop', 
    passport.authenticate('jwt', {session: false}), 
    Crop.postCreateCrop
);

cropRouter.post('/close-crop', 
    passport.authenticate('jwt', {session: false}), 
    Crop.postCloseCrop
)

cropRouter.post('/add-diary', 
    passport.authenticate('jwt', {session: false}), 
    Crop.postDiary
)

module.exports = cropRouter;