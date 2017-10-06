var express = require('express');
var router = express.Router();
var isLoggedIn = require('../middleware/isLoggedIn');
var db = require('../models');

router.get('/:userId', isLoggedIn, function(req, res) {
  res.render('profile');
});

router.get('/:userId/account', function(req, res) {
  res.send('hello');
});

router.put('/:userId/account', function(req, res) {
  res.send('hello!');
});

router.delete('/:userId/account', function(req, res) {
  res.send('goodbye');
});

router.get('/:userId/loans', function(req, res) {

});

router.get('/:userId/loans/:loanId', function(req, res) {

});

module.exports = router;
