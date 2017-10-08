module.exports = function(req, res, next) {
  if (!req.user) {
    res.locals.loggedIn = false;
    req.flash('error', 'You must be logged in to access that page');
    res.redirect('/auth/login');
  } else {
    res.locals.loggedIn = true;
    next();
  }
};
