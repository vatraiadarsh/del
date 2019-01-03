const express = require('express');
const app = express();
const cluster = require('./server');

const init = require('./init');
const router = require('./router');
require('./db');

cluster(app);
init(app);
router(app);

module.exports = app;
