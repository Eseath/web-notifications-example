'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use('/', express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require('dotenv').config();
require('./app/database');
require('./app/push');
require('./app/routes')(app);

const server = app.listen(process.env.PORT || 3000, () => {
    const { port } = server.address();
    console.log(`
        Application running at:
        http://localhost:${port}
    `);
});
