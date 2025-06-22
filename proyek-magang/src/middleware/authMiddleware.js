exports.ensureLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next(); // Sudah login, lanjut ke halaman berikutnya
  } else {
    res.redirect('/login'); // Belum login, arahkan ke login
  }
};
