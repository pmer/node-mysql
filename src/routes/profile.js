import { withConn } from '../db.js';

import * as profile from '../models/profile.js';

//
// The endpoint are:
//
// List     http://localhost:3000/api/profile
// Details  http://localhost:3000/api/profile/pdm
//

export default (router) => {
    // Route path: /
    // Request URL: http://localhost:3000/api/profile
    // req.params: { }
    router.get('/', (req, res) => {
        withConn(res, async (conn) => {
            const profiles = await profile.getProfiles(conn);

            res.json({ profiles });
        });
    });

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
};
