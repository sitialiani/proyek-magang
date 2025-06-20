const express = require('express');
const router = express.Router();

// Data untuk /admin/dashboard
const dashboardData = {
    stats: {
        pengajuanBaru: 8,
        mahasiswaAktif: 125,
        perusahaanMitra: 48,
        dosenPembimbing: 20,
        tanpaPembimbing: 3
    },
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

router.get('/dashboard', (req, res) => {
    // Menggunakan template dari keyword "admin_dashboard"
    res.render('dashboard_admin', {
        data: dashboardData
    });
});

// CONTOH: Data pengguna yang nantinya akan diambil dari database
const users = [
    { id: 1, nama: 'Siti Aliani', email: 'siti.aliani@email.com', peran: 'Mahasiswa', status: 'Aktif' },
    { id: 2, nama: 'Dr. Anjali, S.Kom.', email: 'dr.anjali@email.com', peran: 'Dosen Pembimbing', status: 'Aktif' },
    { id: 3, nama: 'Budi', email: 'budi@email.com', peran: 'Mahasiswa', status: 'Non-Aktif' },
];

/**
 * @route   GET /admin/manajemen-pengguna
 * @desc    Menampilkan halaman manajemen pengguna
 * @access  Private (Hanya untuk Admin)
 */
router.get('/manajemen-pengguna', (req, res) => {
    // Di sini Anda akan mengambil data semua pengguna dari database.
    // Untuk saat ini, kita gunakan data contoh di atas.
    res.render('manajemen_pengguna', { 
        users: users 
    });
});

// Nanti Anda bisa menambahkan rute lain untuk admin di sini
// Contoh: rute untuk form tambah/edit pengguna
// router.get('/tambah-pengguna', (req, res) => { ... });
// router.post('/tambah-pengguna', (req, res) => { ... });


// --- DATA CONTOH UNTUK PROGRESS MAGANG ---
const progressData = {
    stats: {
        mahasiswaAktif: 58,
        logbookBelumDiisi: 12,
        laporanReview: 5,
        telahSelesai: 150
    },
    mahasiswa: [
        { id: 1, nim: '2311522006', nama: 'Siti Aliani', perusahaan: 'PT. Teknologi Nusantara', statusMagang: 'Aktif Magang', dospem: 'Dr. Anjali, S.Kom.', logbook: 'Terisi', laporan: 'Menunggu Review' },
        { id: 2, nim: '2311522001', nama: 'Budi', perusahaan: 'CV. Cipta Karya', statusMagang: 'Menunggu Nilai', dospem: 'Dr. Anjali, S.Kom.', logbook: 'Lengkap', laporan: 'Disetujui' },
        { id: 3, nim: '2311522010', nama: 'Rina Hartati', perusahaan: 'Dinas Kominfo', statusMagang: 'Aktif Magang', dospem: 'Dr. Anjali, S.Kom.', logbook: 'Terlambat 8 hari', laporan: 'Belum Unggah' }
    ]
};


/**
 * @route   GET /admin/progress-magang
 * @desc    Menampilkan halaman monitoring progress magang
 * @access  Private (Hanya untuk Admin)
 */
router.get('/progress-magang', (req, res) => {
    // Mengirim data progress (yang nantinya dari DB) ke view
    res.render('progress_magang', {
        data: progressData
    });
});

// Data untuk /dosen-pembimbing
const pembimbinganData = {
    stats: {
        totalDosen: 12,
        totalMahasiswa: 58,
        tanpaPembimbing: 3,
        rataRata: 4.8
    },
    dosen: [
        { 
            id: 1, 
            nama: 'Dr. Anjali, S.Kom., M.Kom.', 
            nidn: '0123456789',
            foto: 'https://placehold.co/48x48/E7EEF0/5c7a89?text=DA',
            jumlahBimbingan: 2,
            mahasiswa: [
                { nim: '2311522006', nama: 'Siti Aliani', perusahaan: 'PT. Teknologi Nusantara', status: 'Aktif' },
                { nim: '2311522001', nama: 'Budi Santoso', perusahaan: 'CV. Cipta Karya', status: 'Selesai' }
            ]
        },
        { 
            id: 2, 
            nama: 'Rahmat Hidayat, M.T.', 
            nidn: '9876543210',
            foto: 'https://placehold.co/48x48/E7EEF0/5c7a89?text=RH',
            jumlahBimbingan: 5,
            mahasiswa: [] // Contoh dosen tanpa data mahasiswa untuk ditampilkan
        }
    ]
};

/**
 * @route   GET /admin/dosen-pembimbing
 * @desc    Menampilkan halaman manajemen dosen pembimbing
 * @access  Private (Hanya untuk Admin)
 */
router.get('/dosen-pembimbing', (req, res) => {
    // Mengirim data pembimbingan (yang nantinya dari DB) ke view
    res.render('dosen_pembimbing', {
        data: pembimbinganData
    });
});

// Data untuk /manajemen-backup
const backupData = {
    status: {
        otomatisAktif: true,
        backupTerakhir: 'Kamis, 19 Jun 2025, 01:00 WIB',
        jadwalBerikutnya: 'Jumat, 20 Jun 2025, 01:00 WIB'
    },
    riwayat: [
        { tanggal: '19 Jun 2025, 01:00', jenis: 'Otomatis', status: 'Berhasil', ukuran: '25.4 MB', url: '#' },
        { tanggal: '18 Jun 2025, 15:30', jenis: 'Manual', status: 'Berhasil', ukuran: '25.2 MB', url: '#' },
        { tanggal: '18 Jun 2025, 01:00', jenis: 'Otomatis', status: 'Gagal', ukuran: '-', url: null },
    ]
};

/**
 * @route   GET /admin/manajemen-backup
 */
router.get('/manajemen-backup', (req, res) => {
    // Mengirim data backup (yang nantinya dari DB) ke view
    res.render('manajemen_backup', {
        data: backupData
    });
});

router.get("/pengumuman_admin", (req, res) => {
  console.log("Route pengumuman_admin dipanggil!"); // Tambahkan log ini
  res.render("penilaian");
});

router.get("/dashboard_admin", (req, res) => {
  console.log("Route dashboard_admin dipanggil!"); // Tambahkan log ini
  res.render("dashboard_admin");
});

module.exports = router; // <<< WAJIB agar bisa di-require

