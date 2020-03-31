import express from 'express';

import setupApi from './routes/index.js';

const app = express();
const api = express.Router();

//
// Backend API
//
app.use('/api', api);

setupApi(api);

//
// Frontend HTML
//
const indexRoutes = [
    '/$',
    '/person$',
];
function index(req, res) {
    res.sendFile('public/index.html', {
        root: process.cwd(),
    });
}
for (const route of indexRoutes) {
    app.use(route, index);
}

app.use(express.static('public'));

//
// Have a 404 page for all other situations.
//
function send404(req, res) {
    res.sendFile('public/404.html', {
        root: process.cwd(),
    });
}
app.use('/', send404);

///
/// Listen on port 3000.
///
app.listen(3000, () => {
    console.log('Listening on port 3000');
});
