var express = require('express');
var router = express.Router();
var isLoggedIn = require('../middleware/isLoggedIn');
var db = require('../models');

router.get('/', isLoggedIn, function(req, res) {
  db.user.find({
    where: {
      id: req.params.id
    }
  }).then(function(user) {
    res.render('profile', {user: user});
  });
});

router.get('/account', isLoggedIn, function(req, res) {
  res.send('hello');
});

router.get('/account/edit', isLoggedIn, function(req, res) {
  res.send('let\'s change some stuff');
})

router.put('/account', isLoggedIn, function(req, res) {
  res.send('I never knew that about you and we\'ll make note of that');
});

router.delete('/account', isLoggedIn, function(req, res) {
  res.send('goodbye forever');
});

router.get('/loans', isLoggedIn, function(req, res) {
  res.send('heres your loans');
});

router.post('/loans', isLoggedIn, function(req, res) {
  res.send('oh, a new loan!')
});

router.get('/loans/:loanId', isLoggedIn, function(req, res) {
  res.send('heres your loan');
});

router.put('/loans/:loanId', isLoggedIn, function(req, res) {
  res.send('we\'ll take are of that for you and update accordingly');
});

router.delete('/loans/:loanId', isLoggedIn, function(req, res) {
  res.send('good riddance!');
});

module.exports = router;
