<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/login');
  }
});

router.get('/login', authController.showLoginPage);
router.post('/login', authController.handleLogin);

const { isAuthenticated } = require('../middleware/authMiddleware');

router.get('/dashboard', isAuthenticated, (req, res) => {
  res.render('dashboard-mahasiswa', { user: req.session.user });
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
=======
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { ensureAuthenticated, ensureLoggedIn } = require('../../middleware/authMiddleware');

router.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/login');
  }
});

router.get('/login', authController.showLoginPage);
router.post('/login', authController.handleLogin);

router.get('/dashboard', ensureLoggedIn, (req, res) => {
  res.render('dashboard-mahasiswa', { user: req.session.user });
});
router.get('/dashboard', (req, res) => {
  // Pastikan user sudah login dan role mahasiswa
  if (req.session.user && req.session.user.role === 'mahasiswa') {
    return res.render('dashboard-mahasiswa', { user: req.session.user });
  } else {
    return res.redirect('/login');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
>>>>>>> main
