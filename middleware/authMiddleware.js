function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next(); // lanjut ke route berikutnya
  }
  res.redirect('/login');
}

function ensureLoggedIn(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
}

module.exports = {
  ensureAuthenticated,
  ensureLoggedIn
};
