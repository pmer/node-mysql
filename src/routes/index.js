import bodyParser from 'body-parser';
import express from 'express';

import setupProfile from './profile.js';

function log(req, res, next) {
    const { method, path } = req;
    console.log(`${method} ${path}`);
    next();
}

function setupRoutes(router) {
    router.use(log);

    router.use(bodyParser.json());
    router.use(bodyParser.urlencoded({ extended: false }));

    const profile = express.Router();
    router.use('/profile', profile);
    setupProfile(profile);
}

export default setupRoutes;
