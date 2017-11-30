import express from 'express';

import configure from './appConfig';

const app = express();

configure(app);

module.exports = app;
