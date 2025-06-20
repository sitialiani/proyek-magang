
const express = require("express");
const path = require("path");
const sequelize = require('./src/config/sequelize'); // Impor instance Sequelize


const app = express(); // Inisialisasi aplikasi Express


// --- 1. Konfigurasi Awal Express ---
// Konfigurasi View Engine (EJS)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

// Middleware untuk parsing body dari form HTML (urlencoded) dan JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serving file statis (CSS, JS, gambar, dokumen dari folder public)
// Pastikan hanya ada SATU baris ini
app.use(express.static(path.join(__dirname, "public")));


// --- 2. Middleware Autentikasi Dummy (untuk pengembangan) ---
app.use((req, res, next) => {
    // Ini mensimulasikan user yang sudah login sebagai dosen dengan ID 1.
    // Di aplikasi nyata, Anda akan memiliki sistem login/sesi yang sebenarnya.
    // Penting: Pastikan user_id 1 di tabel `users` adalah user dengan role 'dosen' di database Anda.
    req.user = { id: 1, role: 'dosen' }; // Dosen dummy dengan user_id 1
    next();
});


// --- 3. Impor dan Gunakan Routes ---
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
    // Redirect ke dashboard dosen jika user adalah dosen (simulasi login)
    if (req.user && req.user.role === 'dosen') {
        return res.redirect('/dospem/dashboard');
    }
    // Jika tidak ada user atau bukan dosen, tampilkan halaman index.ejs
    // Pastikan 'index' ada di views Anda, dan menerima `title` jika Anda menggunakannya.
    res.render('index', { title: 'Selamat Datang di Sistem Magang' });
});

// Route Logout Sederhana (untuk demo)
app.get('/logout', (req, res) => {
    req.user = null; // Menghapus user dummy
    res.redirect('/');
});


// --- 5. Sinkronisasi Database dan Mulai Server ---
// Fungsi untuk memulai server, agar bisa dipanggil setelah sinkronisasi database
function startServer() {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

// Sinkronisasi database
// Disarankan untuk menjalankan ini HANYA di lingkungan pengembangan.
// Di produksi, gunakan migrasi Sequelize yang lebih terkontrol.
sequelize.sync({ alter: true })
  .then(() => {
    console.log("Database & tables have been synced.");
    startServer(); // Mulai server hanya setelah database berhasil disinkronkan
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
    // Jika sinkronisasi gagal, kemungkinan ingin menghentikan aplikasi
    process.exit(1);
  });