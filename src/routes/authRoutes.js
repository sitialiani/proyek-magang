const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
<<<<<<< HEAD
=======
const { isAuthenticated } = require('../middleware/authMiddleware');
>>>>>>> 7e7ac080241c89bb016f2879b7eaf063e8d85df5

router.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/login');
  }
});

router.get('/login', authController.showLoginPage);
router.post('/login', authController.handleLogin);

<<<<<<< HEAD
const { ensureLoggedIn } = require('../middleware/authMiddleware');

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
=======
router.get('/dashboard', isAuthenticated, (req, res) => {
  res.render('dashboard-mahasiswa', { user: req.session.user });
});
>>>>>>> 7e7ac080241c89bb016f2879b7eaf063e8d85df5

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
