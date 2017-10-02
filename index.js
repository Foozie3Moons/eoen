require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var isLoggedIn = require('./middleware/isLoggedIn');
var sass = require('node-sass');
var glob = require('glob');
var fs = require('fs');
var path = require('path');

var app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/views'));
app.set('view options', {
  layout: false // pug has default layout functionality
});

app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

/*
 * Include the flash module by calling it within app.use().
 * IMPORTANT: This MUST go after the session module
 */
app.use(flash());

app.use(function(req, res, next) {
  // before every route, attach the flash messages and current user to res.locals
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

// These lines must occur after the session config!
var passport = require('./config/ppConfig')

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public/'));

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile');
});

app.use('/auth', require('./controllers/auth'));

var server = app.listen(process.env.PORT || 3000);

module.exports = server;
