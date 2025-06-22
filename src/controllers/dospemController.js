// src/controllers/dospemController.js

// Impor semua model dari index.js
const db = require('../config/sequelize'); // Ini adalah instance Sequelize
const {
    User,
    Mahasiswa,
    Dosen,
    Perusahaan,
    Lowongan,
    PengajuanMagang,
    Dokumen,
    Laporan,
    Penilaian,
    Feedback,
    Logbook
} = require('../../models'); // Ini mengimpor semua model yang sudah didefinisikan relasinya

// Helper untuk mendapatkan data mahasiswa lengkap (termasuk status progres)
const getMahasiswaDetail = async (mhsId) => {
    try {
        const mahasiswa = await Mahasiswa.findByPk(mhsId, {
            include: [
                { model: User, as: 'user', attributes: ['email'] },
                {
                    model: Dosen,
                    as: 'dosen', // Menggunakan alias yang didefinisikan di models/index.js
                    attributes: ['nama']
                }
            ]
        });

        if (!mahasiswa) return null;

        // Hitung logbook pending
        const logbookPendingCount = 0; // Nilai default

        // Ambil status laporan akhir
        const laporan = await Laporan.findOne({
            where: { mahasiswa_id: mahasiswa.id },
            attributes: ['status']
        });
        const statusLaporanAkhir = laporan ? laporan.status.replace('_', ' ').toLowerCase().replace(/\b\w/g, s => s.toUpperCase()) : 'Belum Unggah';

        // Ambil pengajuan magang yang diterima untuk info perusahaan dan periode
        const pengajuanInfo = await PengajuanMagang.findOne({
            where: { mahasiswa_id: mahasiswa.id, status: 'diterima' },
            include: [
                {
                    model: Lowongan,
                    attributes: ['deadlinependaftaran'],
                    include: { model: Perusahaan, attributes: ['nama'] }
                }
            ],
            order: [['tanggal_pengajuan', 'DESC']]
        });

        const statusMagang = pengajuanInfo ? pengajuanInfo.status.replace('_', ' ').toLowerCase().replace(/\b\w/g, s => s.toUpperCase()) : 'Belum Ada Pengajuan';
        const perusahaanTujuan = pengajuanInfo && pengajuanInfo.Lowongan && pengajuanInfo.Lowongan.Perusahaan
                               ? pengajuanInfo.Lowongan.Perusahaan.nama
                               : '-';
        const periodeMagang = pengajuanInfo && pengajuanInfo.Lowongan && pengajuanInfo.Lowongan.deadlinependaftaran
                               ? `${new Date(pengajuanInfo.Lowongan.deadlinependaftaran).toLocaleDateString('id-ID')}`
                               : '-';

        return {
            id: mahasiswa.id,
            nama: mahasiswa.nama,
            nim: mahasiswa.nim, // Sesuaikan dengan kolom DB
            prodi: mahasiswa.jurusan, // Sesuaikan dengan kolom DB
            email: mahasiswa.User ? mahasiswa.User.email : '-',
            angkatan: mahasiswa.angkatan,
            dosen_pembimbing_id: mahasiswa.dosen_pembimbing_id, // Penting untuk verifikasi akses
            statusMagang: statusMagang,
            perusahaanTujuan: perusahaanTujuan,
            periodeMagang: periodeMagang,
            logbookPending: logbookPendingCount,
            statusLaporanAkhir: statusLaporanAkhir
        };

    } catch (error) {
        console.error("Error in getMahasiswaDetail (for mhsId:", mhsId, "):", error);
        return null;
    }
};


// Item 30: Dashboard Dosen Pembimbing
exports.getDashboard = async (req, res) => {
    const dosenUserId = req.user.id; // Asumsi req.user.id adalah ID dari tabel 'users'

    try {
        const dosen = await Dosen.findOne({ where: { user_id: dosenUserId } });

        if (!dosen) {
            return res.status(404).send('Data dosen tidak ditemukan. Pastikan user_id dosen di tabel users sesuai dengan id user di tabel dosen.');
        }

        const namaDosen = dosen.nama;
        const dosenId = dosen.id; // ID dari tabel 'dosen'

        const mahasiswaBimbingan = await Mahasiswa.findAll({
            where: { dosen_pembimbing_id: dosenId },
            attributes: ['id', 'nama']
        });

        const totalMahasiswaBimbingan = mahasiswaBimbingan.length;
        const mahasiswaIdsBimbingan = mahasiswaBimbingan.map(mhs => mhs.id);

        // --- Nonaktifkan Fitur Logbook ---
        const logbookMenungguEvaluasi = 0; // Nilai default
        const recentLogbooks = []; // Nilai default
        // --- Akhir Nonaktifkan Fitur Logbook ---

        const laporanMenungguPenilaian = await Laporan.count({
            where: {
                mahasiswa_id: mahasiswaIdsBimbingan.length > 0 ? mahasiswaIdsBimbingan : [0],
                status: 'menunggu'
            }
        });

        let aktivitasTerbaru = [];

        // --- Nonaktifkan Logika Logbook ---
        // recentLogbooks.forEach(log => { ... }); // Dihapus/dikomen
        // --- Akhir Nonaktifkan Logika Logbook ---

        // Recent Laporan (menunggu penilaian)
        const recentLaporan = await Laporan.findAll({
            where: {
                mahasiswa_id: mahasiswaIdsBimbingan.length > 0 ? mahasiswaIdsBimbingan : [0],
                status: 'menunggu'
            },
            include: [{ model: Mahasiswa, as: 'mahasiswa', attributes: ['nama'] }],
            order: [['tanggal_upload', 'DESC']],
            limit: 5
        });
        recentLaporan.forEach(lap => {
            aktivitasTerbaru.push({
                type: 'Laporan',
                message: `Laporan Akhir dari ${lap.mahasiswa.nama} - Status: Perlu Penilaian`,
                date: new Date(lap.tanggal_upload),
                link: `/dospem/laporan-akhir/nilai/${lap.id}`
            });
        });

        // Recent Pengajuan (diajukan)
        const recentPengajuan = await PengajuanMagang.findAll({
            where: {
                mahasiswa_id: mahasiswaIdsBimbingan.length > 0 ? mahasiswaIdsBimbingan : [0],
                status: 'diajukan'
            },
            include: [{ model: Mahasiswa, as: 'mahasiswa', attributes: ['nama'] }],
            order: [['tanggal_pengajuan', 'DESC']],
            limit: 5
        });
        recentPengajuan.forEach(peng => {
            aktivitasTerbaru.push({
                type: 'Pengajuan',
                message: `Pengajuan magang dari ${peng.mahasiswa.nama} - Status: ${peng.status.toUpperCase()}`,
                date: new Date(peng.tanggal_pengajuan),
                link: `/dospem/pengajuan/${peng.id}/detail`
            });
        });

        aktivitasTerbaru.sort((a, b) => b.date.getTime() - a.date.getTime());
        aktivitasTerbaru = aktivitasTerbaru.slice(0, 5);

        // --- Nonaktifkan Logika Logbook di Kalender ---
        // recentLogbooks.forEach(log => { ... }); // Dihapus/dikomen
        // --- Akhir Nonaktifkan Logika Logbook di Kalender ---

        // Calendar Events
        const calendarEvents = [];
        // --- Nonaktifkan Logika Logbook di Kalender ---
        // recentLogbooks.forEach(log => { ... }); // Dihapus/dikomen
        // --- Akhir Nonaktifkan Logika Logbook di Kalender ---

        recentLaporan.forEach(lap => {
            calendarEvents.push({
                date: new Date(lap.tanggal_upload).toISOString().split('T')[0],
                title: `Laporan Akhir - ${lap.mahasiswa.nama}`,
                type: 'laporan',
                link: `/dospem/laporan-akhir/nilai/${lap.id}`
            });
        });

        recentPengajuan.forEach(peng => {
            calendarEvents.push({
                date: new Date(peng.tanggal_pengajuan).toISOString().split('T')[0],
                title: `Pengajuan Magang - ${peng.mahasiswa.nama}`,
                type: 'pengajuan',
                link: `/dospem/pengajuan/${peng.id}/detail`
            });
        });

        calendarEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

        const dataForView = {
            title: 'Dashboard Dosen Pembimbing',
            namaDosen: namaDosen,
            totalMahasiswaBimbingan: totalMahasiswaBimbingan,
            logbookMenungguEvaluasi: logbookMenungguEvaluasi,
            laporanMenungguPenilaian: laporanMenungguPenilaian,
            aktivitasTerbaru: aktivitasTerbaru,
            calendarEvents: calendarEvents
        };

        res.render('dospem/dashboard', dataForView);

    } catch (error) {
        console.error('Error in getDashboard:', error);
        res.status(500).send('Terjadi kesalahan saat memuat dashboard. Mohon coba lagi nanti.');
    }
};

// Item 31: Melihat Daftar Mahasiswa Bimbingan (List View)
exports.getMahasiswaBimbinganList = async (req, res) => {
    const dosenUserId = req.user.id;

    try {
        const dosen = await Dosen.findOne({ where: { user_id: dosenUserId } });
        if (!dosen) {
            return res.status(404).send('Data dosen tidak ditemukan.');
        }
        const namaDosen = dosen.nama;
        const dosenId = dosen.id;

        const mahasiswaIds = await Mahasiswa.findAll({
            where: { dosen_pembimbing_id: dosenId },
            attributes: ['id']
        });
        const mahasiswaIdsBimbingan = mahasiswaIds.map(mhs => mhs.id);

        const daftarMahasiswaPromises = mahasiswaIdsBimbingan.map(mhsId => getMahasiswaDetail(mhsId));
        const daftarMahasiswa = (await Promise.all(daftarMahasiswaPromises)).filter(mhs => mhs !== null);

        res.render('dospem/daftarMahasiswa', {
            title: 'Mahasiswa Bimbingan',
            mahasiswa: daftarMahasiswa,
            namaDosen: namaDosen
        });

    } catch (error) {
        console.error('Error in getMahasiswaBimbinganList:', error);
        res.status(500).send('Terjadi kesalahan saat memuat daftar mahasiswa bimbingan.');
    }
};

// Item 31 (lanjutan): Melihat Detail Mahasiswa Bimbingan
exports.getDetailMahasiswa = async (req, res) => {
    const dosenUserId = req.user.id;
    const mahasiswaId = parseInt(req.params.id);

    try {
        const dosen = await Dosen.findOne({ where: { user_id: dosenUserId } });
        if (!dosen) {
            return res.status(404).send('Data dosen tidak ditemukan.');
        }
        const namaDosen = dosen.nama;
        const dosenId = dosen.id;

        const mahasiswa = await getMahasiswaDetail(mahasiswaId);

        if (!mahasiswa || mahasiswa.dosen_pembimbing_id !== dosenId) {
            return res.status(403).send('Mahasiswa tidak ditemukan atau Anda tidak memiliki akses.');
        }

        // --- Nonaktifkan Fitur Logbook ---
        const logbooks = []; // Nilai default
        // --- Akhir Nonaktifkan Fitur Logbook ---

        res.render('dospem/detailMahasiswa', {
            title: `Detail Mahasiswa - ${mahasiswa.nama}`,
            mahasiswa,
            logbooks, // Kirim array kosong
            namaDosen
        });

    } catch (error) {
        console.error('Error in getDetailMahasiswa:', error);
        res.status(500).send('Terjadi kesalahan saat memuat detail mahasiswa.');
    }
};

// Item 32: Detail Pengajuan Magang (Simulasi Modal)
exports.getDetailPengajuanMagangModal = async (req, res) => {
    const pengajuanId = parseInt(req.params.id);
    
    console.log('Debug - pengajuanId:', pengajuanId, 'type:', typeof pengajuanId);
    console.log('Debug - req.params:', req.params);
    console.log('Debug - req.user:', req.user);

    try {
        // Handle case where user might not be available (for testing)
        let dosenUserId = req.user ? req.user.id : null;
        let dosen = null;
        let namaDosen = 'Dosen Pembimbing';
        let dosenId = null;

        if (dosenUserId) {
            dosen = await Dosen.findOne({ where: { user_id: dosenUserId } });
            if (dosen) {
                namaDosen = dosen.nama;
                dosenId = dosen.id;
            }
        }

        // If no dosen found, try to get the first dosen for testing
        if (!dosen) {
            console.log('Debug - No dosen found for user, trying to get first dosen for testing');
            dosen = await Dosen.findOne();
            if (dosen) {
                namaDosen = dosen.nama;
                dosenId = dosen.id;
                console.log('Debug - Using first dosen for testing:', dosen.nama, 'ID:', dosen.id);
            } else {
                console.log('Debug - No dosen found in database at all');
                return res.status(404).send('Data dosen tidak ditemukan di database.');
            }
        }

        console.log('Debug - Looking for pengajuan with ID:', pengajuanId);
        
        const pengajuan = await PengajuanMagang.findByPk(pengajuanId, {
            include: [
                {
                    model: Mahasiswa,
                    as: 'mahasiswa',
                    attributes: ['nama', 'nim', 'jurusan', 'no_hp', 'dosen_pembimbing_id'],
                    include: [{ model: User, as: 'user', attributes: ['email'] }]
                },
                {
                    model: Lowongan,
                    as: 'lowongan',
                    attributes: ['perusahaan', 'deskripsi', 'deadlinependaftaran'],
                    include: [{ model: Perusahaan, as: 'detailPerusahaan', attributes: ['nama', 'alamat', 'email', 'telepon', 'pic'] }]
                }
            ]
        });

        console.log('Debug - pengajuan found:', pengajuan ? 'yes' : 'no');
        console.log('Debug - pengajuan structure:', JSON.stringify(pengajuan, null, 2));

        if (!pengajuan) {
            return res.status(404).send('Pengajuan Magang tidak ditemukan.');
        }

        // Verifikasi bahwa mahasiswa dari pengajuan ini adalah bimbingan dosen yang login
        console.log('Debug - pengajuan.Mahasiswa:', pengajuan.Mahasiswa);
        console.log('Debug - pengajuan.mahasiswa:', pengajuan.mahasiswa);
        
        if (!pengajuan.Mahasiswa && !pengajuan.mahasiswa) {
            return res.status(500).send('Data mahasiswa tidak ditemukan dalam pengajuan.');
        }
        
        const mahasiswaData = pengajuan.Mahasiswa || pengajuan.mahasiswa;
        
        // Skip dosen verification for testing if no dosenId available
        if (dosenId && mahasiswaData.dosen_pembimbing_id !== dosenId) {
            return res.status(403).send('Anda tidak memiliki akses ke pengajuan ini.');
        }

        // Ambil dokumen pendukung untuk pengajuan ini
        const dokumenRows = await Dokumen.findAll({
            where: { pengajuan_id: pengajuan.id },
            attributes: ['nama_file', 'file_path']
        });

        // Map data ke format yang diharapkan oleh EJS
        const mahasiswaDataFormatted = {
            nama: mahasiswaData.nama,
            nim: mahasiswaData.nim,
            prodi: mahasiswaData.jurusan,
            email: mahasiswaData.user ? mahasiswaData.user.email : '-',
            telepon: mahasiswaData.no_hp
        };

        const magangData = {
            perusahaan: pengajuan.lowongan && pengajuan.lowongan.detailPerusahaan ? pengajuan.lowongan.detailPerusahaan.nama : 'Tidak diketahui',
            alamat: pengajuan.lowongan && pengajuan.lowongan.detailPerusahaan ? pengajuan.lowongan.detailPerusahaan.alamat : 'Tidak diketahui',
            posisi: pengajuan.lowongan ? pengajuan.lowongan.perusahaan : 'Tidak diketahui',
            periode: pengajuan.lowongan && pengajuan.lowongan.deadlinependaftaran ? `${new Date(pengajuan.lowongan.deadlinependaftaran).toLocaleDateString('id-ID')}` : 'Tidak diketahui',
            deskripsi: pengajuan.lowongan ? pengajuan.lowongan.deskripsi : 'Tidak diketahui'
        };

        const pembimbingLapangan = {
            nama: pengajuan.lowongan && pengajuan.lowongan.detailPerusahaan ? (pengajuan.lowongan.detailPerusahaan.pic || 'Belum Ditentukan') : 'Belum Ditentukan',
            jabatan: 'PIC Perusahaan',
            email: pengajuan.lowongan && pengajuan.lowongan.detailPerusahaan ? (pengajuan.lowongan.detailPerusahaan.email || '-') : '-',
            telepon: pengajuan.lowongan && pengajuan.lowongan.detailPerusahaan ? (pengajuan.lowongan.detailPerusahaan.telepon || '-') : '-'
        };

        const pengajuanStatusData = {
            status: pengajuan.status.replace('_', ' ').toLowerCase().replace(/\b\w/g, s => s.toUpperCase()),
            tanggalVerifikasi: new Date(pengajuan.tanggal_pengajuan).toLocaleDateString('id-ID', {
                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
            }) + ' WIB',
            catatanAdmin: null // Tidak ada di skema pengajuan_magang Anda
        };

        res.render('dospem/detail_pengajuan', {
            title: `Detail Pengajuan Magang - ${mahasiswaDataFormatted.nama}`,
            mahasiswa: mahasiswaDataFormatted,
            magang: magangData,
            pembimbingLapangan: pembimbingLapangan,
            pengajuan: pengajuanStatusData,
            dokumen: dokumenRows.map(doc => ({ nama: doc.nama_file, url: doc.file_path })),
            namaDosen: namaDosen
        });

    } catch (error) {
        console.error('Error in getDetailPengajuanMagangModal:', error);
        res.status(500).send('Terjadi kesalahan saat memuat detail pengajuan magang.');
    }
};


// Item 33, 34: Evaluasi Logbook (List View)
exports.getEvaluasiLogbookList = async (req, res) => {
    const dosenUserId = req.user.id;

    try {
        const dosen = await Dosen.findOne({ where: { user_id: dosenUserId } });
        if (!dosen) {
            return res.status(404).send('Data dosen tidak ditemukan.');
        }
        const namaDosen = dosen.nama;
        const dosenId = dosen.id;

        const mahasiswaIdsBimbingan = await Mahasiswa.findAll({
            where: { dosen_pembimbing_id: dosenId },
            attributes: ['id']
        });
        const safeMahasiswaIds = mahasiswaIdsBimbingan.map(mhs => mhs.id);

        const logbooksForEvaluation = await Logbook.findAll({
            where: {
                mahasiswa_id: safeMahasiswaIds.length > 0 ? safeMahasiswaIds : [0]
            },
            include: [{ model: Mahasiswa, attributes: ['nama', 'nim'] }],
            order: [['tanggal', 'DESC']]
        });

        const formattedLogbooks = logbooksForEvaluation.map(log => ({
            id: log.id,
            tanggal: log.tanggal,
            deskripsiKegiatan: log.kegiatan,
            judulKegiatan: log.kegiatan.substring(0, Math.min(log.kegiatan.length, 50)) + (log.kegiatan.length > 50 ? '...' : ''),
            statusEvaluasi: log.verifikasi_dosen ? 'sudah dievaluasi' : 'menunggu evaluasi',
            mahasiswaNama: log.Mahasiswa.nama,
            mahasiswaNim: log.Mahasiswa.nim
        }));

        res.render('dospem/evaluasiLogbookList', {
            title: 'Evaluasi Logbook',
            logbooks: formattedLogbooks,
            namaDosen: namaDosen
        });

    } catch (error) {
        console.error('Error in getEvaluasiLogbookList:', error);
        res.status(500).send('Terjadi kesalahan saat memuat daftar evaluasi logbook.');
    }
};

// Item 33, 34: Evaluasi Logbook (Simulasi Modal)
exports.getEvaluasiLogbookFormModal = async (req, res) => {
    const dosenUserId = req.user.id;
    const logbookId = parseInt(req.params.logbookId);

    try {
        const dosen = await Dosen.findOne({ where: { user_id: dosenUserId } });
        if (!dosen) {
            return res.status(404).send('Data dosen tidak ditemukan.');
        }
        const namaDosen = dosen.nama;
        const dosenId = dosen.id;

        const logbook = await Logbook.findByPk(logbookId, {
            include: [
                {
                    model: Mahasiswa,
                    attributes: ['nama', 'nim', 'dosen_pembimbing_id'],
                    include: [{ model: User, as: 'user', attributes: ['email'] }]
                }
            ]
        });

        if (!logbook) {
            return res.status(404).send('Logbook tidak ditemukan.');
        }

        if (logbook.Mahasiswa.dosen_pembimbing_id !== dosenId) {
            return res.status(403).send('Anda tidak memiliki akses untuk mengevaluasi logbook ini.');
        }

        const mahasiswaData = {
            id: logbook.Mahasiswa.id,
            nama: logbook.Mahasiswa.nama,
            nim: logbook.Mahasiswa.nim
        };

        const pengajuan = await PengajuanMagang.findOne({
            where: { mahasiswa_id: mahasiswaData.id, status: 'diterima' },
            include: [
                {
                    model: Lowongan,
                    attributes: ['perusahaan'],
                    include: { model: Perusahaan, attributes: ['nama'] }
                }
            ],
            order: [['tanggal_pengajuan', 'DESC']]
        });
        const companyInfo = pengajuan && pengajuan.Lowongan && pengajuan.Lowongan.Perusahaan ? {
            namaPerusahaan: pengajuan.Lowongan.Perusahaan.nama,
            posisi: pengajuan.Lowongan.perusahaan
        } : null;


        // Ambil komentar dosen terakhir untuk mahasiswa ini dari tabel feedback
        const feedback = await Feedback.findOne({
            where: { mahasiswa_id: mahasiswaData.id, dosen_id: dosenId },
            order: [['tanggal', 'DESC']]
        });
        const komentarDosenTerakhir = feedback ? feedback.pesan : '';


        res.render('dospem/evaluasiLogbookModal', {
            title: `Evaluasi Logbook Magang`,
            logbook: {
                id: logbook.id,
                judulKegiatan: logbook.kegiatan,
                deskripsiKegiatan: logbook.kegiatan,
                tanggal: logbook.tanggal,
                statusEvaluasi: logbook.verifikasi_dosen ? 'sudah dievaluasi' : 'menunggu evaluasi',
                komentarDosen: komentarDosenTerakhir,
                fileLampiran: null // Jika ada di tabel logbook, tambahkan di model
            },
            mahasiswa: mahasiswaData,
            pengajuan: companyInfo,
            namaDosen: namaDosen
        });

    } catch (error) {
        console.error('Error in getEvaluasiLogbookFormModal:', error);
        res.status(500).send('Terjadi kesalahan saat memuat form evaluasi logbook.');
    }
};

exports.postEvaluasiLogbook = async (req, res) => {
    const dosenUserId = req.user.id;
    const logbookId = parseInt(req.params.logbookId);
    const { komentarDosen, statusLogbook } = req.body;

    try {
        const dosen = await Dosen.findOne({ where: { user_id: dosenUserId } });
        if (!dosen) {
            return res.status(404).send('Data dosen tidak ditemukan.');
        }
        const dosenId = dosen.id;

        const logbook = await Logbook.findByPk(logbookId, {
            include: [{ model: Mahasiswa, attributes: ['dosen_pembimbing_id'] }]
        });

        if (!logbook) {
            return res.status(404).send('Logbook tidak ditemukan.');
        }

        if (logbook.Mahasiswa.dosen_pembimbing_id !== dosenId) {
            return res.status(403).send('Anda tidak memiliki akses untuk mengevaluasi logbook ini.');
        }

        const verifikasiStatus = (statusLogbook === 'sudah dievaluasi');
        await logbook.update({ verifikasi_dosen: verifikasiStatus });

        if (komentarDosen && komentarDosen.trim() !== '') {
            // Upsert: mencari feedback yang sudah ada, jika ada update, jika tidak buat baru
            await Feedback.upsert({
                mahasiswa_id: logbook.mahasiswa_id,
                dosen_id: dosenId,
                pesan: komentarDosen,
                tanggal: new Date()
            }, {
                // Tentukan kriteria untuk mencari record yang akan diupdate
                // Dalam kasus ini, kita bisa mencari feedback dari dosen ini ke mahasiswa ini
                // dan mengupdate yang terbaru, atau selalu membuat baru.
                // Untuk kesederhanaan, kita akan selalu membuat baru jika tidak ada primary key
                // yang cocok untuk upsert. Jika ingin update, perlu id feedback spesifik.
                // Atau, Anda bisa mendefinisikan unique constraint di model Feedback untuk mahasiswa_id dan dosen_id
                // Contoh simpel, akan membuat baru jika tidak ada 'id' yang cocok.
                // Jika ingin update: findByPk, lalu update.
                // Karena feedback tidak ada unique ID untuk pasangan mhs-dosen untuk update harian,
                // kita akan selalu INSERT baru, atau Anda perlu menambahkan kolom `logbook_id` ke tabel feedback.
            });
        }

        res.redirect(`/dospem/evaluasi-logbook`);

    } catch (error) {
        console.error('Error in postEvaluasiLogbook:', error);
        res.status(500).send('Terjadi kesalahan saat menyimpan evaluasi logbook.');
    }
};


// Item 35, 36: Penilaian Laporan Akhir (List View)
exports.getPenilaianLaporanAkhirList = async (req, res) => {
    const dosenUserId = req.user.id;

    try {
        const dosen = await Dosen.findOne({ where: { user_id: dosenUserId } });
        if (!dosen) {
            return res.status(404).send('Data dosen tidak ditemukan.');
        }
        const namaDosen = dosen.nama;
        const dosenId = dosen.id;

        const mahasiswaBimbingan = await Mahasiswa.findAll({
            where: { dosen_pembimbing_id: dosenId },
            attributes: ['id']
        });
        const safeMahasiswaIds = mahasiswaBimbingan.map(mhs => mhs.id);

        const laporanForPenilaian = await Laporan.findAll({
            where: {
                mahasiswa_id: safeMahasiswaIds.length > 0 ? safeMahasiswaIds : [0]
            },
            include: [
                { model: Mahasiswa, attributes: ['nama', 'nim'] },
                { model: Penilaian, attributes: ['nilai_akhir', 'komentar', 'tanggal'], required: false } // LEFT JOIN
            ],
            order: [['tanggal_upload', 'DESC']]
        });

        const formattedLaporan = await Promise.all(laporanForPenilaian.map(async (lap) => {
            const pengajuan = await PengajuanMagang.findOne({
                where: { mahasiswa_id: lap.mahasiswa_id, status: 'diterima' },
                include: [{ model: Lowongan, include: { model: Perusahaan, attributes: ['nama'] } }],
                order: [['tanggal_pengajuan', 'DESC']]
            });
            const perusahaanMagang = pengajuan && pengajuan.Lowongan && pengajuan.Lowongan.Perusahaan
                                   ? pengajuan.Lowongan.Perusahaan.nama
                                   : '-';
            return {
                id: lap.id,
                mahasiswaId: lap.mahasiswa_id,
                judul: lap.judul,
                file_path: lap.file_path,
                status: lap.status,
                tanggal_upload: lap.tanggal_upload,
                mahasiswaNama: lap.Mahasiswa.nama,
                mahasiswaNim: lap.Mahasiswa.nim,
                nilai: lap.Penilaian ? lap.Penilaian.nilai_akhir : null,
                komentarDosen: lap.Penilaian ? lap.Penilaian.komentar : null,
                tanggalPenilaian: lap.Penilaian ? lap.Penilaian.tanggal : null,
                statusPenilaian: lap.status, // Tetap gunakan status dari tabel laporan
                perusahaanMagang: perusahaanMagang
            };
        }));


        res.render('dospem/penilaianLaporanAkhirList', {
            title: 'Penilaian Laporan Akhir',
            laporanAkhir: formattedLaporan,
            namaDosen: namaDosen
        });

    } catch (error) {
        console.error('Error in getPenilaianLaporanAkhirList:', error);
        res.status(500).send('Terjadi kesalahan saat memuat daftar penilaian laporan akhir.');
    }
};

// Item 35, 36: Penilaian Magang (Simulasi Modal)
exports.getPenilaianLaporanFormModal = async (req, res) => {
    const dosenUserId = req.user.id;
    const laporanId = parseInt(req.params.laporanId);

    try {
        const dosen = await Dosen.findOne({ where: { user_id: dosenUserId } });
        if (!dosen) {
            return res.status(404).send('Data dosen tidak ditemukan.');
        }
        const namaDosen = dosen.nama;
        const dosenId = dosen.id;

        const laporanAkhir = await Laporan.findByPk(laporanId, {
            include: [
                {
                    model: Mahasiswa,
                    attributes: ['nama', 'nim', 'dosen_pembimbing_id']
                },
                {
                    model: Penilaian,
                    attributes: ['nilai_akhir', 'komentar'],
                    required: false // LEFT JOIN
                }
            ]
        });

        if (!laporanAkhir) {
            return res.status(404).send('Laporan akhir tidak ditemukan.');
        }

        if (laporanAkhir.Mahasiswa.dosen_pembimbing_id !== dosenId) {
            return res.status(403).send('Anda tidak memiliki akses untuk menilai laporan ini.');
        }

        const mahasiswaData = {
            id: laporanAkhir.Mahasiswa.id,
            nama: laporanAkhir.Mahasiswa.nama,
            nim: laporanAkhir.Mahasiswa.nim
        };

        const pengajuan = await PengajuanMagang.findOne({
            where: { mahasiswa_id: mahasiswaData.id, status: 'diterima' },
            include: [
                {
                    model: Lowongan,
                    attributes: ['perusahaan'],
                    include: { model: Perusahaan, attributes: ['nama'] }
                }
            ],
            order: [['tanggal_pengajuan', 'DESC']]
        });
        const companyInfo = pengajuan && pengajuan.Lowongan && pengajuan.Lowongan.Perusahaan ? {
            namaPerusahaan: pengajuan.Lowongan.Perusahaan.nama,
            posisi: pengajuan.Lowongan.perusahaan
        } : null;

        // Data penilaian komponen (masih di-parsing dari komentar karena tidak ada kolom terpisah)
        const penilaianKomponen = {
            kinerjaTugas: null,
            feedbackKinerja: '',
            kedisiplinan: null,
            feedbackKedisiplinan: '',
            kolaborasiKomunikasi: null,
            feedbackKolaborasi: '',
        };
        // Coba parsing komentar jika formatnya seperti "Kinerja: feedback | Kedisiplinan: feedback | Kolaborasi: feedback"
        if (laporanAkhir.Penilaian && laporanAkhir.Penilaian.komentar) {
            const parts = laporanAkhir.Penilaian.komentar.split(' | ');
            parts.forEach(part => {
                if (part.startsWith('Kinerja:')) penilaianKomponen.feedbackKinerja = part.replace('Kinerja: ', '');
                if (part.startsWith('Kedisiplinan:')) penilaianKomponen.feedbackKedisiplinan = part.replace('Kedisiplinan: ', '');
                if (part.startsWith('Kolaborasi:')) penilaianKomponen.feedbackKolaborasi = part.replace('Kolaborasi: ', '');
            });
        }


        res.render('dospem/penilaianMagangModal', {
            title: `Penilaian Magang`,
            laporanAkhir: {
                id: laporanAkhir.id,
                judul: laporanAkhir.judul,
                fileLaporan: laporanAkhir.file_path,
                nilai: laporanAkhir.Penilaian ? laporanAkhir.Penilaian.nilai_akhir : null, // Nilai akhir dari tabel penilaian
                komentarDosen: laporanAkhir.Penilaian ? laporanAkhir.Penilaian.komentar : null, // Komentar dari tabel penilaian
                statusPenilaian: laporanAkhir.status // Status laporan dari tabel laporan
            },
            mahasiswa: mahasiswaData,
            pengajuan: companyInfo,
            penilaianKomponen: penilaianKomponen,
            namaDosen: namaDosen
        });

    } catch (error) {
        console.error('Error in getPenilaianLaporanFormModal:', error);
        res.status(500).send('Terjadi kesalahan saat memuat form penilaian laporan.');
    }
};

exports.postPenilaianLaporan = async (req, res) => {
    const dosenUserId = req.user.id;
    const laporanId = parseInt(req.params.laporanId);
    const {
        nilaiAkhir,
        nilaiKinerjaTugas, feedbackKinerjaTugas,
        nilaiKedisiplinan, feedbackKedisiplinan,
        nilaiKolaborasiKomunikasi, feedbackKolaborasiKomunikasi
    } = req.body;

    try {
        const dosen = await Dosen.findOne({ where: { user_id: dosenUserId } });
        if (!dosen) {
            return res.status(404).send('Data dosen tidak ditemukan.');
        }
        const dosenId = dosen.id;

        const laporanAkhir = await Laporan.findByPk(laporanId, {
            include: [{ model: Mahasiswa, attributes: ['id', 'dosen_pembimbing_id'] }]
        });

        if (!laporanAkhir) {
            return res.status(404).send('Laporan akhir tidak ditemukan.');
        }

        if (laporanAkhir.Mahasiswa.dosen_pembimbing_id !== dosenId) {
            return res.status(403).send('Anda tidak memiliki akses untuk menilai laporan ini.');
        }

        const combinedKomentar = `Kinerja: ${feedbackKinerjaTugas || '-'} | Kedisiplinan: ${feedbackKedisiplinan || '-'} | Kolaborasi: ${feedbackKolaborasiKomunikasi || '-'}`;

        // Upsert (Insert or Update) penilaian
        await Penilaian.upsert({
            mahasiswa_id: laporanAkhir.mahasiswa_id,
            dosen_id: dosenId,
            nilai_akhir: parseFloat(nilaiAkhir),
            komentar: combinedKomentar,
            tanggal: new Date()
        });

        // Update status laporan di tabel 'laporan' menjadi 'diterima'
        await laporanAkhir.update({ status: 'diterima' });

        // Upsert rekapitulasi
        await Rekapitulasi.upsert({
            mahasiswa_id: laporanAkhir.mahasiswa_id,
            nilai_akhir: parseFloat(nilaiAkhir),
            status_laporan: 'selesai',
            tanggal_rekap: new Date()
        });

        res.redirect(`/dospem/penilaian-laporan-akhir`);

    } catch (error) {
        console.error('Error in postPenilaianLaporan:', error);
        res.status(500).send('Terjadi kesalahan saat menyimpan penilaian laporan.');
    }
};