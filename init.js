const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const helmet = require('helmet');
const csrf = require('csurf');
const passport = require('passport');
const fileUpload = require('express-fileupload');
const validator = require('express-validator');
const compression = require('compression');
const favicon = require('serve-favicon');

require('./config/passport')(passport);

module.exports = (app) => {
  if (process.env.NODE_ENV === 'development') {
    const morgan = require('morgan');
    app.use(morgan('dev'));
  }
  const middleware = [
    express.static(path.join(__dirname, 'public')),
    bodyParser.urlencoded({
      extended: true,
    }),
    bodyParser.json(),
    validator(),
    cookieParser('mySecretCookieParser'),
    session({
      secret: 'super-secret-key',
      key: 'super-secret-cookie',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 60000,
      },
    }),
    flash(),
    helmet(),
    passport.initialize(),
    passport.session(),
    csrf({
      cookie: true,
    }),
    fileUpload(),
    compression(),
  ];
  app.use(middleware);


  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

  app.locals.moment = require('moment');

  app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.info_msg = req.flash('info_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });


  app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
  app.use('/jquery',
      express.static(path.join(__dirname, 'node_modules/jquery/dist/')));
  app.use('/bootstrap',
      express.static(path.join(__dirname, 'node_modules/bootstrap/dist/')));
  app.use('/font-awesome',
      express.static(path.join(__dirname, 'node_modules/font-awesome/')));
};
