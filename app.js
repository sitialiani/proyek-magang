const express = require("express");
const app = express();
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));


app.use(express.static(path.join(__dirname, "public"))); // ← ini yang benar

app.get("/", (req, res) => {
  res.render("index");
});


//routes mahasiswa
const mahasiswaRoutes = require('./src/routes/mahasiswaRoutes');
// Gunakan rute ini dengan prefix /mahasiswa
app.use('/mahasiswa', mahasiswaRoutes);


//routes admin
const adminRoutes = require('./src/routes/adminRoutes');
// Gunakan rute ini dengan prefix /admin
app.use('/admin', adminRoutes);


//routes dospem
const dospemRoutes = require('./src/routes/dospemRoutes');
app.use('/dospem', dospemRoutes);
=======
// Route baru untuk logbook
app.get("/logbook", (req, res) => {
  res.render("logbook"); // Render file logbook.ejs
});

// Route baru untuk riwayatlogbook
app.get("/RiwayatLogbook", (req, res) => {
  res.render("RiwayatLogbook"); // Render file riwayatlogbook.ejs
});

// Route baru untuk laporanAkhir
app.get("/laporan", (req, res) => {
  res.render("laporan"); // Render file riwayatlogbook.ejs
});

// Route baru untuk pengumuman
app.get("/pengumuman", (req, res) => {
  res.render("pengumuman"); // Render file pengumuman.ejs
});

// Route baru untuk penilaian
app.get("/penilaian", (req, res) => {
  res.render("penilaian"); // Render file penilaian.ejs
});

// Route baru untuk penilaian
app.get("/pengumuman_admin", (req, res) => {
  res.render("pengumuman_admin"); // Render file pengumuman_admin.ejs
});

// Route baru untuk penilaian
app.get("/dashboard_admin", (req, res) => {
  res.render("dashboard_admin"); // Render file dashboard_admin.ejs
});

const mahasiswaRoutes = require('./src/routes/mahasiswaRoutes.js');
app.use('/', mahasiswaRoutes); // atau sesuai base URL

const adminRoutes = require('./src/routes/mahasiswaRoutes.js');
app.use('/', adminRoutes); // atau sesuai base URL

console.log("laporan_akhir");
console.log("progress_magang");

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
