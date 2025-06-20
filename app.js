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

// Route baru untuk logbook
app.get("/logbook", (req, res) => {
  res.render("logbook"); // Render file logbook.ejs
});



const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
