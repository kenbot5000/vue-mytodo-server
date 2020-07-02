require('dotenv').config();
const express = require('express');
const consola = require('consola')
const bodyParser = require('body-parser');
const app = express();

const api = require('./router');

app.use(bodyParser.json());
app.use('/', api);

const host = process.env.HOST;
const port = process.env.PORT;

app.listen(port, host);
consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
});
