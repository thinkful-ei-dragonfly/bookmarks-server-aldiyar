/* eslint-disable quotes */
/* eslint-disable eqeqeq */
/* eslint-disable strict */
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } =require('./config');
const bookmarksRouter = require('./bookmarks/bookmarks-router');
const errorHandler = require('./errors');
const validateBearerToken = require('./validator');





const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(cors());
app.use(helmet());
app.use(validateBearerToken);

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use(bookmarksRouter);
app.use(errorHandler);

module.exports =  app;

