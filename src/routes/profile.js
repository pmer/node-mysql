import { ERR_MYSQL_DUP_ENTRY, withConn } from '../db.js';
import * as password from '../password.js';

import * as profile from '../models/profile.js';

//
// The endpoint are:
//
// List     GET  http://localhost:3000/api/profile
// Details  GET  http://localhost:3000/api/profile/pdm
// Create   POST http://localhost:3000/api/profile
// Login    POST http://localhost:3000/api/login
//

const CURRENT_DATE = {
    toSqlString: () => 'CURRENT_DATE()',
};

export default (routers) => {
    // Route method: GET
    // Route path: /profile
    // Request URL: http://localhost:3000/api/profile
    // req.params: { }
    routers.profile.get('/', (req, res) => {
        withConn(res, async (conn) => {
            const profiles = await profile.getProfiles(conn);

            res.json({ profiles });
        });
    });

    // Route method: GET
    // Route path: /profile/:username
    // Request URL: http://localhost:3000/api/profile/pdm
    // req.params: {
    //     "username": "pdm"
    // }
    routers.profile.get('/:username', async (req, res) => {
        withConn(res, async (conn) => {
            const { username } = req.params;

            const prof = await profile.getProfileByUsername(conn, username);

            if (prof === null) {
                res.sendStatus(404);
                return;
            }

            res.json({ profile: prof });
        });
    });

    // Route method: POST
    // Route path: /profile
    // Request URL: http://localhost:3000/api/profile
    // req.body: {
    //     "username": "ammc",
    //     "password": "password",
    //     "body": "Body for profile ammc",
    //     "description": "Description for profile ammc"
    // }
    routers.profile.post('/', async (req, res) => {
        withConn(res, async (conn) => {
            const { username, password: pw, body, description } = req.body;

            const invalid =
                !profile.isUsernameValid(username) ||
                !password.isPasswordValid(pw) ||
                !profile.isBodyValid(body) ||
                !profile.isDescriptionValid(description);

            if (invalid) {
                res.status(400).send('Invalid request parameters');
                return;
            }

            const salt = await password.makeSalt();
            const hash = await password.hashPassword(pw, salt);

            try {
                await profile.createProfile(conn, {
                    username,
                    password: hash.toString('hex'),
                    salt: salt.toString('hex'),
                    created: CURRENT_DATE,
                    updated: CURRENT_DATE,
                    body,
                    description,
                });
            } catch (err) {
                if (err.code === ERR_MYSQL_DUP_ENTRY) {
                    res.status(400).send('Profile already exists');
                    return;
                }

                throw err;
            }

            res.send('OK');
        });
    });

    // Route method: POST
    // Route path: /login
    // Request URL: http://localhost:3000/api/login
    // req.body: {
    //     "username": "ammc",
    //     "password": "password"
    // }
    routers.login.post('/', async (req, res) => {
        withConn(res, async (conn) => {
            const { username, password: pw } = req.body;

            const invalid =
                !profile.isUsernameValid(username) ||
                !password.isPasswordValid(pw);

            if (invalid) {
                res.status(400).send('Invalid request parameters');
                return;
            }

            const prof = await profile.getProfileByUsername(conn, username);

            if (prof === null) {
                res.status(400).send('User does not exist');
                return;
            }

            const salt = Buffer.from(prof.salt, 'hex');
            const hash = await password.hashPassword(pw, salt);

            if (prof.password !== hash.toString('hex')) {
                res.status(400).send('Incorrect password');
                return;
            }

            res.send('OK');
        });
    });
};
