const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { uploadPengumuman } = require('../config/multer');

// Data untuk Dashboard
const dashboardData = {
    stats: { pengajuanBaru: 8, mahasiswaAktif: 125, perusahaanMitra: 48, dosenPembimbing: 20, tanpaPembimbing: 3 },
    tugas: [
        { teks: 'Verifikasi 8 pengajuan magang baru', label: 'Baru', warna: 'blue', link: '#' },
        { teks: 'Alokasikan pembimbing untuk 3 mahasiswa', label: 'Penting', warna: 'red', link: '#' },
        { teks: 'Lihat 2 feedback baru dari perusahaan', label: '', warna: '', link: '#' }
    ],
    aktivitas: [
        { ikon: 'file-plus-2', warna: 'blue', teks: '<strong>Budi Santoso</strong> mengajukan magang ke <strong>PT. Maju Jaya</strong>.', waktu: '15 menit lalu' },
        { ikon: 'award', warna: 'green', teks: '<strong>Dr. Anggun</strong> memberikan nilai akhir untuk mahasiswa <strong>Siti Lestari</strong>.', waktu: '1 jam lalu' },
        { ikon: 'building', warna: 'indigo', teks: 'Anda berhasil menambahkan <strong>PT. Cipta Karya</strong> sebagai mitra baru.', waktu: '3 jam lalu' }
    ]
};

// Data untuk Manajemen Pengguna
let users = [
    { id: 1, nama: 'Siti Aliani', email: 'siti.aliani@email.com', peran: 'Mahasiswa', status: 'Aktif' },
    { id: 2, nama: 'Dr. Anjali, S.Kom.', email: 'dr.anjali@email.com', peran: 'Dosen Pembimbing', status: 'Aktif' },
    { id: 3, nama: 'Budi', email: 'budi@email.com', peran: 'Mahasiswa', status: 'Non-Aktif' },
];

// Data untuk Progress Magang
const progressData = {
    stats: { mahasiswaAktif: 58, logbookBelumDiisi: 12, laporanReview: 5, telahSelesai: 150 },
    mahasiswa: [
        { id: 1, nim: '2311522006', nama: 'Siti Aliani', perusahaan: 'PT. Teknologi Nusantara', statusMagang: 'Aktif Magang', dospem: 'Dr. Anjali, S.Kom.', logbook: 'Terisi', laporan: 'Menunggu Review' },
        { id: 2, nim: '2311522001', nama: 'Budi', perusahaan: 'CV. Cipta Karya', statusMagang: 'Menunggu Nilai', dospem: 'Dr. Anjali, S.Kom.', logbook: 'Lengkap', laporan: 'Disetujui' },
        { id: 3, nim: '2311522010', nama: 'Rina Hartati', perusahaan: 'Dinas Kominfo', statusMagang: 'Aktif Magang', dospem: 'Dr. Anjali, S.Kom.', logbook: 'Terlambat 8 hari', laporan: 'Belum Unggah' }
    ]
};

// Data untuk Dosen Pembimbing
const pembimbinganData = {
    stats: { totalDosen: 12, totalMahasiswa: 58, tanpaPembimbing: 3, rataRata: 4.8 },
    dosen: [
        { id: 1, nama: 'Dr. Anjali, S.Kom., M.Kom.', nidn: '0123456789', foto: 'https://placehold.co/48x48/E7EEF0/5c7a89?text=DA', jumlahBimbingan: 2, mahasiswa: [ { nim: '2311522006', nama: 'Siti Aliani', perusahaan: 'PT. Teknologi Nusantara', status: 'Aktif' }, { nim: '2311522001', nama: 'Budi Santoso', perusahaan: 'CV. Cipta Karya', status: 'Selesai' } ] },
        { id: 2, nama: 'Rahmat Hidayat, M.T.', nidn: '9876543210', foto: 'https://placehold.co/48x48/E7EEF0/5c7a89?text=RH', jumlahBimbingan: 5, mahasiswa: [] }
    ]
};

// Data untuk Pengajuan Magang
let pengajuanMagang = [
    { id: 1, nim: '2311522001', nama: 'Budi Santoso', perusahaan: 'PT. Maju Jaya', status: 'Belum Diverifikasi' },
    { id: 2, nim: '2311522002', nama: 'Siti Aliani', perusahaan: 'CV. Cipta Karya', status: 'Belum Diverifikasi' }
];

// Data untuk Feedback Perusahaan
let feedbackData = [
    { id: 1, namaMahasiswa: 'Budi Santoso', nim: '2311522001', perusahaan: 'PT. Maju Jaya', isi: 'Mahasiswa ini sangat aktif dan disiplin.', tanggal: '2025-06-20' },
    { id: 2, namaMahasiswa: 'Siti Aliani', nim: '2311522002', perusahaan: 'CV. Cipta Karya', isi: 'Perlu peningkatan dalam komunikasi tim.', tanggal: '2025-06-18' }
];

// Data untuk Template Dokumen
const templateDokumen = [
    { id: 1, nama: 'Surat Pengantar Magang', file: '/files/surat_pengantar.docx' },
    { id: 2, nama: 'Surat Pengantar Magang', file: '/files/surat_pengantar.pdf' },
];

// Data untuk Mitra Perusahaan
const mitraList = [
    { id: 1, nama: 'PT. Teknologi Nusantara', alamat: 'Jl. Merdeka No. 12', kontak: 'hrd@teknologi.co.id' },
    { id: 2, nama: 'CV. Cipta Karya', alamat: 'Jl. Melati No. 5', kontak: 'cp.ciptakarya@gmail.com' }
];

// Data untuk Manajemen Backup
const backupData = {
    status: { otomatisAktif: true, backupTerakhir: 'Kamis, 19 Jun 2025, 01:00 WIB', jadwalBerikutnya: 'Jumat, 20 Jun 2025, 01:00 WIB' },
    riwayat: [
        { tanggal: '19 Jun 2025, 01:00', jenis: 'Otomatis', status: 'Berhasil', ukuran: '25.4 MB', url: '#' },
        { tanggal: '18 Jun 2025, 15:30', jenis: 'Manual', status: 'Berhasil', ukuran: '25.2 MB', url: '#' },
        { tanggal: '18 Jun 2025, 01:00', jenis: 'Otomatis', status: 'Gagal', ukuran: '-', url: null },
    ]
};

// =================================================================
// --- DEFINISI RUTE ADMIN ---
// =================================================================
// --- Rute Utama & Manajemen Pengguna ---
router.get('/dashboard', (req, res) => {
    res.render('dashboard_admin', { data: dashboardData });
});

router.get('/manajemen-pengguna', (req, res) => {
    res.render('manajemen_pengguna', { users: users });
});


// --- Rute Proses Magang ---
router.get('/pengajuan-magang', (req, res) => {
    res.render('pengajuan_magang', { pengajuan: pengajuanMagang });
});

router.post('/pengajuan/verifikasi/:id', (req, res) => {
    const id = parseInt(req.params.id);
    pengajuanMagang = pengajuanMagang.map(item =>
        item.id === id ? { ...item, status: 'Terverifikasi' } : item
    );
    res.redirect('/admin/pengajuan-magang');
});

router.get('/progress-magang', (req, res) => {
    res.render('progress_magang', { data: progressData });
});

router.get('/dosen-pembimbing', (req, res) => {
    res.render('dosen_pembimbing', { data: pembimbinganData });
});


// --- Rute Kemitraan & Lowongan ---
//tampila,hapus,tambah
router.get('/lowongan-magang', adminController.getLowongan);
router.post('/lowongan/tambah', adminController.tambahLowongan);
router.post('/lowongan/hapus/:id', adminController.hapusLowongan);


// Tampilkan halaman mitra
router.get('/mitra-perusahaan', adminController.getMitra);
router.post('/mitra-perusahaan/tambah', adminController.tambahMitra);
router.post('/mitra-perusahaan/hapus/:id', adminController.hapusMitra);


router.get('/feedback-perusahaan', (req, res) => {
    res.render('feedback_perusahaan', { feedback: feedbackData });
});

// Laporan Statistik
router.get('/laporan-statistik', adminController.getLaporanStatistik);


// --- Rute Konten & Komunikasi ---
router.get("/pengumuman", adminController.getPengumumanPage);

/**
 * @route   POST /admin/pengumuman/save
 * @desc    Menyimpan pengumuman baru.
 */
router.post('/pengumuman/save', uploadPengumuman.single('lampiran'), (err, req, res, next) => {
    if (err) {
        return res.status(400).json({ 
            success: false, 
            message: err.message 
        });
    }
    next();
}, adminController.savePengumuman);

/**
 * @route   PUT /admin/pengumuman/update
 * @desc    Mengupdate pengumuman yang sudah ada.
 */
router.put('/pengumuman/update', uploadPengumuman.single('lampiran'), (err, req, res, next) => {
    if (err) {
        return res.status(400).json({ 
            success: false, 
            message: err.message 
        });
    }
    next();
}, adminController.updatePengumuman);

/**
 * @route   DELETE /admin/pengumuman/delete/:id
 * @desc    Menghapus pengumuman berdasarkan ID.
 */
router.delete('/pengumuman/delete/:id', adminController.deletePengumuman);

/**
 * @route   GET /admin/pengumuman/api/all
 * @desc    Mengambil semua pengumuman untuk API.
 */
router.get('/pengumuman/api/all', adminController.getAllPengumuman);

router.get('/template-dokumen', (req, res) => {
    res.render('template_dokumen', { templates: templateDokumen });
});


// --- Rute Pengaturan Sistem ---
router.get('/manajemen-backup', (req, res) => {
    res.render('manajemen_backup', { data: backupData });
});

router.get("/Pengumuman_admin", (req, res) => {
  console.log("Route Pengumuman_admin dipanggil!"); // Tambahkan log ini
  res.render("Pengumuman_admin");
});

router.get("/dashboard_admin", (req, res) => {
  console.log("Route dashboard_admin dipanggil!"); // Tambahkan log ini
  res.render("dashboard_admin");
});

module.exports = router; // <<< WAJIB agar bisa di-require


// =================================================================
// --- EKSPOR ROUTER (WAJIB DI AKHIR FILE) ---
// =================================================================
module.exports = router;

