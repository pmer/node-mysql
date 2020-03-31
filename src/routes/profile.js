import { ERR_MYSQL_DUP_ENTRY, withConn } from '../db.js';

import * as profile from '../models/profile.js';

//
// The endpoint are:
//
// List     GET  http://localhost:3000/api/profile
// Details  GET  http://localhost:3000/api/profile/pdm
// Create   POST http://localhost:3000/api/profile
//

const CURRENT_DATE = {
    toSqlString: () => 'CURRENT_DATE()',
};

export default (router) => {
    // Route method: GET
    // Route path: /
    // Request URL: http://localhost:3000/api/profile
    // req.params: { }
    router.get('/', (req, res) => {
        withConn(res, async (conn) => {
            const profiles = await profile.getProfiles(conn);

            res.json({ profiles });
        });
    });

    // Route method: GET
    // Route path: /:username
    // Request URL: http://localhost:3000/api/profile/pdm
    // req.params: { "username": "pdm" }
    router.get('/:username', async (req, res) => {
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
    // Route path: /
    // Request URL: http://localhost:3000/api/profile
    // req.body: {
    //     "username": "ammc",
    //     "password": "password",
    //     "body": "Body for profile ammc",
    //     "description": "Description for profile ammc"
    // }
    router.post('/', async (req, res) => {
        withConn(res, async (conn) => {
            const { username, password, body, description } = req.body;

            const invalid =
                !profile.isUsernameValid(username) ||
                !profile.isPasswordValid(password) ||
                !profile.isBodyValid(body) ||
                !profile.isDescriptionValid(description);

            if (invalid) {
                res.status(400).send('Invalid request parameters');
                return;
            }

            try {
                await profile.createProfile(conn, {
                    username,
                    password,
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
};
