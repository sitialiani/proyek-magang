const User = require('../../models/user');
const bcrypt = require('bcrypt');

exports.showLoginPage = (req, res) => {
  res.render('login', { error: null });
};

exports.handleLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.render('login', { error: 'Username tidak ditemukan.' });
    }

    // const isMatch = await bcrypt.compare(password, user.password);
    const isMatch = password === user.password;
    if (!isMatch) {
      return res.render('login', { error: 'Password salah.' });
    }

    if (user.role === 'mahasiswa') {
      req.session.user = {
        id: user.id,
        username: user.username,
        role: user.role
        };
    
      return res.redirect('/mahasiswa/dashboard');
    } else {
      return res.render('login', { error: 'Role bukan mahasiswa.' });
    }

  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan server');
  }

};
