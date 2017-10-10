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
    res.redirect('/profile/loans');
    // res.render('profile/index', {user: user, active: 'home'});
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
    },
    include: [db.loan]
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
      userId: req.user.id,
      loanAmount: req.body.loanAmount,
      downPayment: req.body.downPayment,
      apr: req.body.apr,
      lifeOfLoan: req.body.lifeOfLoan,
      paymentsPerYear: req.body.paymentsPerYear
    },
    defaults: {
      userId: req.user.id,
      name: req.body.name,
      loanAmount: req.body.loanAmount,
      downPayment: req.body.downPayment,
      apr: req.body.apr,
      lifeOfLoan: req.body.lifeOfLoan,
      paymentsPerYear: req.body.paymentsPerYear
    }
  }).spread(function(loan, created) {
    if (created) {
      res.redirect('/profile/loans/' + loan.id)
    } else {
      req.flash('error', 'A loan with those parameters already exists');
      res.redirect('/profile/loans/new');
    }
  });
});

router.get('/loans/:loanId', isLoggedIn, function(req, res) {
  db.user.find({
    where: {
      id: req.user.id
    },
    include: [{
      model: db.loan,
      where: {
        id: req.params.loanId
      }
    }]
  }).then(function(user) {
    res.render('loans/loan/show', {
      user: user,
      loan: user.loans[0],
      active: 'loans'
    });
  });
});

router.get('/loans/:loanId/edit', isLoggedIn, function(req, res) {
  db.user.find({
    where: {
      id: req.user.id
    },
    include: [{
      model: db.loan,
      where: {
        id: req.params.loanId
      }
    }]
  }).then(function(user) {
    res.render('loans/loan/edit', {
      user: user,
      loan: user.loans[0],
      active: 'loans'
    })
  })
})

router.put('/loans/:loanId', isLoggedIn, function(req, res) {
  db.loan.update({
    name: req.body.name,
    loanAmount: req.body.loanAmount,
    downPayment: req.body.downPayment,
    apr: req.body.apr,
    lifeOfLoan: req.body.lifeOfLoan,
    paymentsPerYear: req.body.paymentsPerYear
  }, {
    where: {
      id: req.params.loanId
    }
  }).then(function(loan) {
    res.send("success");
  })});

router.delete('/loans/:loanId', isLoggedIn, function(req, res) {
  db.loan.destroy({
    where: {
      id: req.params.loanId
    }
  }).then(function(loan) {
    res.send("success");
  })
});

module.exports = router;
