var express = require('express');
var router = express.Router();
var isLoggedIn = require('../middleware/isLoggedIn');
var db = require('../models');

router.get('/', isLoggedIn, function(req, res) {
  db.user.find({
    where: {
      id: req.user.id
    }
  }).then(function(user) {
    res.render('profile/index', {user: user, active: 'home'});
  });
});

router.get('/account', isLoggedIn, function(req, res) {
  db.user.find({
    where: {
      id: req.user.id
    }
  }).then(function(user) {
    res.render('profile/account/show', {
      user: user,
      active: 'account'
    });
  });
});

router.get('/account/edit', isLoggedIn, function(req, res) {
  db.user.find({
    where: {
      id: req.user.id
    }
  }).then(function(user) {
    res.render('profile/account/edit', {
      user: user,
      active: 'account'
    });
  });
});

router.put('/account', isLoggedIn, function(req, res) {
  db.user.update({
    name: req.body.name,
    email: req.body.email,
  }, {
    where: {
      id: req.user.id
    },
    returning: true
  }).then(function(user) {
    res.send('success');
  });
});

router.delete('/account', isLoggedIn, function(req, res) {
  db.user.destroy({
    where: {
      user: req.user.id
    }
  }).then(function(user) {
    res.redirect('/');
  });
});

router.get('/loans', isLoggedIn, function(req, res) {
  db.user.find({
    where: {
      id: req.user.id
    }
  }).then(function(user) {
    res.render('loans/show', {
      user: user,
      active: 'loans'
    })
  });
});

router.get('/loans/new', isLoggedIn, function(req, res) {
  db.user.find({
    where: {
      id: req.user.id
    }
  }).then(function(user) {
    res.render('loans/new', {
      user: user,
      active: 'new'
    });
  });
});

router.post('/loans', isLoggedIn, function(req, res) {
  db.loan.findOrCreate({
    where: {
      userId: req.user.idea,
      initial_amount: req.body.amount,
      down_payment: req.body.downPayment,
      interest_rate: req.body.interestRate,
      life_of_loan: req.body.lifeOfLoan,
      payments_per_year: req.body.paymentsPerYear
    },
    defaults: {
      userId: req.user.idea,
      initial_amount: req.body.amount,
      down_payment: req.body.downPayment,
      interest_rate: req.body.interestRate,
      life_of_loan: req.body.lifeOfLoan,
      payments_per_year: req.body.paymentsPerYear
    }
  }).spread(function(loan, created) {
    if (created) {
      res.redirect('/profile/loan/' + loan.id)
    } else {
      req.flash('error', 'A loan with those parameters already exists');
      res.redirect('/profile/loan/new');
    }
  });
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
