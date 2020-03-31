import express from 'express';

import setupProfile from './profile.js';

export default (router) => {
    const profile = express.Router();
    router.use('/profile', profile);
    setupProfile(profile);
};
