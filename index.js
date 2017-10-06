require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var request = require('request');
var path = require('path');
var d3 = require('d3');

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

app.get('/*', function(req, res, next){
  res.setHeader('Last-Modified', (new Date()).toUTCString());
  next();
});

app.get('/', function(req, res) {
  request.get("https://www.quandl.com/api/v3/datasets/FMAC/30US.json?api_key="
      + process.env.QUANDL_API_KEY, function(error, response, body) {
    console.log(body);
    res.render('index.pug', {data: body});
  });
});

app.get('/demo', function(req, res) {
  res.render('demo');
});

app.use('/auth', require('./controllers/auth'));
app.use('/user', require('./controllers/profile'));

var server = app.listen(process.env.PORT || 3000);

module.exports = server;
