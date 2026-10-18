require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var handlebars = require('hbs');
var passport = require('passport');

// Load models before Passport and routes.
require('./app_api/models/db');
require('./app_api/models/user');
require('./app_api/config/passport');

var indexRouter = require('./app_server/routes/index');
var usersRouter = require('./app_server/routes/users');
var travlrRouter = require('./app_server/routes/travlr');
var apiRouter = require('./app_api/routes/index');

var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'hbs');
app.set('view options', { layout: 'layouts/layout' });

handlebars.registerPartials(
  path.join(__dirname, 'app_server', 'views', 'partials')
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

// Enable CORS
app.use('/api', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/travel', travlrRouter);
app.use('/api', apiRouter);

// Catch unauthorized errors
app.use(function(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      message: err.message
    });
  }

  next(err);
});

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
