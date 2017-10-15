'use strict';

/**
 * Setting up a global http error for handle API errors
 */
import { HttpError } from './utils/http-error';
global.HttpError = HttpError;

import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import routing from './route';
import './models';
import { config } from './utils';
import { ClientError, ServerError } from './route/error/http-error';

let app = express();

// uncomment after placing your favicon in /public
app.use(morgan('tiny'));
app.use(cookieParser(config.cookieSecret));
app.enable('trust proxy');
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: true
}));

app.use('/', routing);

app.use(ClientError);
app.use(ServerError);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Page not found');
  err.status = 404;
  res.status(err.status).end(err.message);
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (process.env.NODE_ENV === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    console.error(err);
    res.end();
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.end();
});

export default app;