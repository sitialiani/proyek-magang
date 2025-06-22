const express = require("express");
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require("path");
const sequelize = require('./src/config/sequelize'); // Impor instance Sequelize


const app = express(); // Inisialisasi aplikasi Express
const authRoutes = require('./src/routes/authRoutes');
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');
// Konfigurasi View Engine (EJS)
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'rahasia-sesi-login',
  resave: false,
  saveUninitialized: true
}));
app.set("views", path.join(__dirname, "src/views"));

app.use('/', authRoutes);

// Middleware untuk parsing body dari form HTML (urlencoded) dan JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serving file statis (CSS, JS, gambar, dokumen dari folder public)
app.use(express.static(path.join(__dirname, "public")));

-
app.use((req, res, next) => {
    req.user = { id: 1, role: 'dosen' }; // Dosen dummy dengan user_id 1
    next();
});

// Impor dan gunakan rute mahasiswa
const mahasiswaRoutes = require('./src/routes/mahasiswaRoutes');
app.use('/mahasiswa', mahasiswaRoutes);

// Impor dan gunakan rute admin
const adminRoutes = require('./src/routes/adminRoutes');
app.use('/admin', adminRoutes);

// Impor dan gunakan rute dospem
const dospemRoutes = require('./src/routes/dospemRoutes');
app.use('/dospem', dospemRoutes);

// --- 4. Route Halaman Utama dan Logout ---
app.get('/', (req, res) => {
    
    if (req.user && req.user.role === 'dosen') {
        return res.redirect('/dospem/dashboard');
    }

    res.render('index', { title: 'Selamat Datang di Sistem Magang' });
});

app.get('/logout', (req, res) => {
    req.user = null; // Menghapus user dummy
    res.redirect('/');
});

const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});