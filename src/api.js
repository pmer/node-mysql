import { withConn } from './db.js';

import * as people from './models/person.js';

//
// The endpoint are:
//
// List     http://localhost:3000/person
// Details  http://localhost:3000/person/2
//

export default (router) => {
    // Route path: /person
    // Request URL: http://localhost:3000/api/person
    // req.params: { }
    router.get('/person', (req, res) => {
        withConn(res, async (conn) => {
            const people = await people.getPeople(conn);

            res.json({ people });
        });
    });

    // Route path: /person/:id
    // Request URL: http://localhost:3000/api/person/2
    // req.params: { "id": 2 }
    router.get('/person/:id(\\d+)', async (req, res) => {
        withConn(res, async (conn) => {
            const { id } = req.params;

            const person = await people.getPerson(conn, id);

            if (person === null) {
                res.sendStatus(404);
                return;
            }

            res.json({ person });
        });
    });
};
