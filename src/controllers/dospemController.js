const db = require('../config/sequelize'); // Ini adalah instance Sequelize
const { Op } = require('sequelize'); // Impor Op untuk operator Sequelize seperti LIKE
const {
    User,
    Mahasiswa,
    Dosen,
    Perusahaan,
    Lowongan,
    PengajuanMagang,
    Dokumen, // PASTIKAN DOKUMEN SUDAH DIIMPOR
    Logbook,
    Laporan,
    Penilaian,
    Feedback,
    Rekapitulasi // Pastikan Rekapitulasi juga diimpor jika digunakan
} = require('../../models'); // Ini mengimpor semua model yang sudah didefinisikan relasinya

// Helper untuk mendapatkan data mahasiswa lengkap (termasuk status progres)
const getMahasiswaDetail = async (mhsId) => {
    try {
        // Pastikan mhsId adalah angka dan valid
        if (isNaN(mhsId) || mhsId <= 0) {
            console.error("Invalid Mahasiswa ID provided to getMahasiswaDetail:", mhsId);
            return null;
        }

        const mahasiswa = await Mahasiswa.findByPk(mhsId, {
            include: [
                { model: User, as: 'User', attributes: ['email'] },
                {
                    model: Dosen,
                    as: 'DosenPembimbing',
                    attributes: ['nama']
                }
            ]
        });

        if (!mahasiswa) {
            return null;
        }

        // Hitung logbook pending
        const logbookPendingCount = await Logbook.count({
            where: {
                mahasiswa_id: mahasiswa.id,
                verifikasi_dosen: false
            }
        });

        // Ambil status laporan akhir
        const laporan = await Laporan.findOne({
            where: { mahasiswa_id: mahasiswa.id },
            attributes: ['status']
        });
        const statusLaporanAkhir = laporan ? laporan.status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, s => s.toUpperCase()) : 'Belum Unggah';

        // Ambil pengajuan magang yang diterima untuk info perusahaan dan periode
        const pengajuanInfoDiterima = await PengajuanMagang.findOne({
            where: { mahasiswa_id: mahasiswa.id, status: 'diterima' },
            include: [
                {
                    model: Lowongan,
                    as: 'Lowongan',
                    attributes: ['perusahaan', 'lokasi', 'durasi', 'deadlinependaftaran', 'deskripsi'],
                }
            ],
            order: [['tanggal_pengajuan', 'DESC']]
        });

        // Ambil STATUS PENGAJUAN TERBARU untuk filter di daftarMahasiswa
        const statusPengajuanTerbaruObj = await PengajuanMagang.findOne({
            where: { mahasiswa_id: mahasiswa.id },
            attributes: ['status'],
            order: [['tanggal_pengajuan', 'DESC']]
        });

        const statusMagang = statusPengajuanTerbaruObj ? statusPengajuanTerbaruObj.status.toLowerCase().replace(/ /g, '') : 'belum ada pengajuan';

        const perusahaanTujuan = pengajuanInfoDiterima && pengajuanInfoDiterima.Lowongan
                                 ? pengajuanInfoDiterima.Lowongan.perusahaan
                                 : '-';
        const periodeMagang = pengajuanInfoDiterima && pengajuanInfoDiterima.Lowongan && pengajuanInfoDiterima.Lowongan.deadlinependaftaran
                                 ? `Deadline: ${new Date(pengajuanInfoDiterima.Lowongan.deadlinependaftaran).toLocaleDateString('id-ID')}`
                                 : '-';

        return {
            id: mahasiswa.id,
            nama: mahasiswa.nama,
            nim: mahasiswa.npm,
            prodi: mahasiswa.jurusan,
            email: mahasiswa.User ? mahasiswa.User.email : '-',
            angkatan: mahasiswa.angkatan,
            dosen_pembimbing_id: mahasiswa.dosen_pembimbing_id,
            statusMagang: statusMagang,
            perusahaanTujuan: perusahaanTujuan,
            periodeMagang: periodeMagang,
            logbookPending: logbookPendingCount,
            statusLaporanAkhir: statusLaporanAkhir,
        };

    } catch (error) {
        console.error("Error in getMahasiswaDetail (for mhsId:", mhsId, "):", error);
        return null;
    }
};


// Item 30: Dashboard Dosen Pembimbing
exports.getDashboard = async (req, res) => {
    const dosenUserId = req.user.id;

    try {
        const dosen = await Dosen.findOne({ where: { user_id: dosenUserId } });

        if (!dosen) {
            console.error('Error: Dosen data not found for user ID:', dosenUserId);
            return res.status(404).send('Data dosen tidak ditemukan. Pastikan user_id dosen di tabel users sesuai dengan id user di tabel dosen.');
        }

        const namaDosen = dosen.nama;
        const dosenId = dosen.id;

        const mahasiswaBimbingan = await Mahasiswa.findAll({
            where: { dosen_pembimbing_id: dosenId },
            attributes: ['id', 'nama']
        });

        const totalMahasiswaBimbingan = mahasiswaBimbingan.length;
        const mahasiswaIdsBimbingan = mahasiswaBimbingan.length > 0 ? mahasiswaBimbingan.map(mhs => mhs.id) : [0];

        const logbookMenungguEvaluasi = await Logbook.count({
            where: {
                mahasiswa_id: mahasiswaIdsBimbingan,
                verifikasi_dosen: false
            }
        });

        const laporanMenungguPenilaian = await Laporan.count({
            where: {
                mahasiswa_id: mahasiswaIdsBimbingan,
                status: 'menunggu'
            }
        });

        let aktivitasTerbaru = [];

        // Recent Logbooks (menunggu evaluasi)
        const recentLogbooks = await Logbook.findAll({
            where: {
                mahasiswa_id: mahasiswaIdsBimbingan,
                verifikasi_dosen: false
            },
            include: [{ model: Mahasiswa, as: 'Mahasiswa', attributes: ['nama'] }],
            order: [['tanggal', 'DESC']],
            limit: 5
        });
        recentLogbooks.forEach(log => {
            aktivitasTerbaru.push({
                type: 'Logbook',
                message: `Logbook Magang dari ${log.Mahasiswa.nama} - Status: Perlu Evaluasi`,
                date: new Date(log.tanggal),
                link: `/dospem/logbook/evaluasi/${log.id}`
            });
        });

        // Recent Laporan (menunggu penilaian)
        const recentLaporan = await Laporan.findAll({
            where: {
                mahasiswa_id: mahasiswaIdsBimbingan,
                status: 'menunggu'
            },
            include: [{ model: Mahasiswa, as: 'Mahasiswa', attributes: ['nama'] }],
            order: [['tanggal_upload', 'DESC']],
            limit: 5
        });
        recentLaporan.forEach(lap => {
            aktivitasTerbaru.push({
                type: 'Laporan',
                message: `Laporan Akhir dari ${lap.Mahasiswa.nama} - Status: Perlu Penilaian`,
                date: new Date(lap.tanggal_upload),
                link: `/dospem/laporan-akhir/nilai/${lap.id}`
            });
        });

        // Recent Pengajuan (diajukan)
        const recentPengajuan = await PengajuanMagang.findAll({
            where: {
                mahasiswa_id: mahasiswaIdsBimbingan,
                status: 'diajukan'
            },
            include: [{ model: Mahasiswa, as: 'Mahasiswa', attributes: ['nama'] }],
            order: [['tanggal_pengajuan', 'DESC']],
            limit: 5
        });
        recentPengajuan.forEach(peng => {
            aktivitasTerbaru.push({
                type: 'Pengajuan',
                message: `Pengajuan magang dari ${peng.Mahasiswa.nama} - Status: ${peng.status.toUpperCase()}`,
                date: new Date(peng.tanggal_pengajuan),
                link: `/dospem/pengajuan/${peng.id}/detail`
            });
        });

        aktivitasTerbaru.sort((a, b) => b.date.getTime() - a.date.getTime());
        aktivitasTerbaru = aktivitasTerbaru.slice(0, 5); // Ambil 5 aktivitas terbaru saja

        // Calendar Events (memastikan tanggal format ISO untuk JS)
        const calendarEvents = [];
        recentLogbooks.forEach(log => {
             calendarEvents.push({
                 date: new Date(log.tanggal).toISOString().split('T')[0],
                 title: `Logbook ${log.Mahasiswa.nama} (${log.kegiatan.substring(0, Math.min(log.kegiatan.length, 20))}...)`,
                 type: 'logbook',
                 link: `/dospem/logbook/evaluasi/${log.id}`
             });
        });

        recentLaporan.forEach(lap => {
            calendarEvents.push({
                date: new Date(lap.tanggal_upload).toISOString().split('T')[0],
                title: `Laporan Akhir - ${lap.Mahasiswa.nama}`,
                type: 'laporan',
                link: `/dospem/laporan-akhir/nilai/${lap.id}`
            });
        });

        recentPengajuan.forEach(peng => {
            calendarEvents.push({
                date: new Date(peng.tanggal_pengajuan).toISOString().split('T')[0],
                title: `Pengajuan Magang - ${peng.Mahasiswa.nama}`,
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
    const { search, statusFilter } = req.query; // Ambil parameter search dan statusFilter

    try {
        const dosen = await Dosen.findOne({ where: { user_id: dosenUserId } });
        if (!dosen) {
            console.error('Error: Dosen data not found for user ID:', dosenUserId);
            return res.status(404).send('Data dosen tidak ditemukan.');
        }
        const namaDosen = dosen.nama;
        const dosenId = dosen.id;

        let whereMahasiswa = {
            dosen_pembimbing_id: dosenId
        };

        if (search) {
            whereMahasiswa.nama = { [Op.like]: `%${search}%` };
        }

        const mahasiswaList = await Mahasiswa.findAll({
            where: whereMahasiswa,
            attributes: ['id', 'nama']
        });

        let daftarMahasiswa = [];
        for (const mhs of mahasiswaList) {
            const detail = await getMahasiswaDetail(mhs.id);
            if (detail) {
                daftarMahasiswa.push(detail);
            }
        }

        // Filter daftarMahasiswa berdasarkan status pengajuan jika statusFilter diberikan
        if (statusFilter) {
            daftarMahasiswa = daftarMahasiswa.filter(mhs => {
                return mhs.statusMagang === statusFilter; // 'mhs.statusMagang' sudah dinormalisasi di getMahasiswaDetail
            });
        }


        res.render('dospem/daftarMahasiswa', {
            title: 'Mahasiswa Bimbingan',
            mahasiswa: daftarMahasiswa,
            namaDosen: namaDosen,
            search: search || '',
            statusFilter: statusFilter || ''
        });

    } catch (error) {
        console.error('Error in getMahasiswaBimbinganList:', error);
        res.status(500).send('Terjadi kesalahan saat memuat daftar mahasiswa bimbingan.');
    }
};

// Item 31 (lanjutan): Melihat Detail Mahasiswa Bimbingan
exports.getDetailMahasiswa = async (req, res) => {
    const dosenUserId = req.user.id;
    const mahasiswaId = parseInt(req.params.id); // Pastikan ini adalah INTEGER

    // Validasi ID
    if (isNaN(mahasiswaId) || mahasiswaId <= 0) {
        console.error('Invalid Mahasiswa ID received:', req.params.id);
        return res.status(400).send('ID Mahasiswa tidak valid.');
    }

    try {
        const dosen = await Dosen.findOne({ where: { user_id: dosenUserId } });
        if (!dosen) {
            console.error('Error: Dosen data not found for user ID:', dosenUserId);
            return res.status(404).send('Data dosen tidak ditemukan.');
        }
        const namaDosen = dosen.nama;
        const dosenId = dosen.id;

        const mahasiswa = await getMahasiswaDetail(mahasiswaId);

        if (!mahasiswa) {
            console.error(`Mahasiswa with ID ${mahasiswaId} not found or getMahasiswaDetail failed.`);
            return res.status(404).send('Mahasiswa tidak ditemukan.');
        }
        if (mahasiswa.dosen_pembimbing_id !== dosenId) {
            console.error(`Unauthorized access: Dosen ${dosenId} tried to access Mahasiswa ${mahasiswaId} (Pembimbing: ${mahasiswa.dosen_pembimbing_id})`);
            return res.status(403).send('Anda tidak memiliki akses ke mahasiswa ini.');
        }

        const logbooks = await Logbook.findAll({
            where: { mahasiswa_id: mahasiswaId },
            order: [['tanggal', 'DESC']]
        });
        const formattedLogbooks = logbooks.map(log => ({
            id: log.id,
            minggu: 'N/A', // Asumsi ini tidak ada di DB Anda, bisa disesuaikan
            tanggal: log.tanggal,
            deskripsiKegiatan: log.kegiatan,
            statusEvaluasi: log.verifikasi_dosen ? 'sudah dievaluasi' : 'menunggu evaluasi',
            komentarDosen: '', // Perlu diambil dari tabel Feedback jika ada
            judulKegiatan: log.kegiatan.substring(0, Math.min(log.kegiatan.length, 50)) + (log.kegiatan.length > 50 ? '...' : '')
        }));


        const laporanAkhir = await Laporan.findOne({
            where: { mahasiswa_id: mahasiswaId },
            include: [{ model: Penilaian, as: 'Penilaian', attributes: ['nilai_akhir', 'komentar'] }]
        });

        const formattedLaporanAkhir = laporanAkhir ? {
            id: laporanAkhir.id,
            judul: laporanAkhir.judul,
            fileLaporan: laporanAkhir.file_path,
            tanggalUpload: laporanAkhir.tanggal_upload,
            statusPenilaian: laporanAkhir.status,
            nilai: laporanAkhir.Penilaian ? laporanAkhir.Penilaian.nilai_akhir : null,
            komentarDosen: laporanAkhir.Penilaian ? laporanAkhir.Penilaian.komentar : null
        } : null;


        const pengajuanMagang = await PengajuanMagang.findAll({
            where: { mahasiswa_id: mahasiswaId },
            include: [
                {
                    model: Lowongan,
                    as: 'Lowongan',
                    attributes: ['perusahaan', 'lokasi', 'durasi', 'deadlinependaftaran', 'deskripsi'],
                },
                { // BARIS INI: TAMBAHKAN INCLUDE DOKUMEN UNTUK MENGAMBIL PATH FILE
                    model: Dokumen,
                    as: 'Dokumen',
                    attributes: ['nama_file', 'jenis', 'file_path'],
                    required: false
                }
            ],
            order: [['tanggal_pengajuan', 'DESC']]
        });

        const formattedPengajuanMagang = pengajuanMagang.map(peng => {
            // EKSTRAK PATH DOKUMEN DARI ARRAY Dokumen YANG DI-INCLUDE
            const suratDoc = peng.Dokumen ? peng.Dokumen.find(doc => doc.jenis === 'surat') : null;
            const cvDoc = peng.Dokumen ? peng.Dokumen.find(doc => doc.jenis === 'CV') : null;
            const proposalDoc = peng.Dokumen ? peng.Dokumen.find(doc => doc.jenis === 'proposal') : null;

            return {
                id: peng.id,
                mahasiswaId: peng.mahasiswa_id,
                namaPerusahaan: peng.Lowongan ? peng.Lowongan.perusahaan : '-',
                posisi: peng.Lowongan ? peng.Lowongan.deskripsi.substring(0, Math.min(peng.Lowongan.deskripsi.length, 50)) + '...' : '-',
                tanggalMulai: peng.Lowongan ? new Date(peng.Lowongan.deadlinependaftaran) : null,
                tanggalSelesai: peng.Lowongan ? new Date(new Date(peng.Lowongan.deadlinependaftaran).setMonth(new Date(peng.Lowongan.deadlinependaftaran).getMonth() + parseInt(peng.Lowongan.durasi))) : null,
                statusPengajuan: peng.status,
                komentarDosen: peng.komentar_dosen,
                suratPath: suratDoc ? suratDoc.file_path : null, // PATH DINAMIS
                cvPath: cvDoc ? cvDoc.file_path : null,         // PATH DINAMIS
                proposalPath: proposalDoc ? proposalDoc.file_path : null // PATH DINAMIS
            };
        });


        res.render('dospem/detailMahasiswa', {
            title: `Detail Mahasiswa: ${mahasiswa.nama}`,
            mahasiswa: mahasiswa,
            logbooks: formattedLogbooks,
            laporanAkhir: formattedLaporanAkhir,
            pengajuanMagang: formattedPengajuanMagang,
            namaDosen: namaDosen
        });

    } catch (error) {
        console.error('Error in getDetailMahasiswa:', error);
        res.status(500).send('Terjadi kesalahan saat memuat detail mahasiswa. Silakan coba lagi.');
    }
};

// Item 32: Detail Pengajuan Magang (Simulasi Modal)
exports.getDetailPengajuanMagangModal = async (req, res) => {
    const dosenUserId = req.user.id;
    const pengajuanId = parseInt(req.params.id);

    try {
        const dosen = await Dosen.findOne({ where: { user_id: dosenUserId } });
        if (!dosen) {
            return res.status(404).send('Data dosen tidak ditemukan.');
        }
        const namaDosen = dosen.nama;
        const dosenId = dosen.id;

        const pengajuan = await PengajuanMagang.findByPk(pengajuanId, {
            include: [
                {
                    model: Mahasiswa,
                    as: 'Mahasiswa',
                    attributes: ['nama', 'npm', 'jurusan', 'no_hp', 'dosen_pembimbing_id'],
                    include: [{ model: User, as: 'User', attributes: ['email'] }]
                },
                {
                    model: Lowongan,
                    as: 'Lowongan',
                    attributes: ['perusahaan', 'lokasi', 'durasi', 'deadlinependaftaran', 'deskripsi'],
                }
            ]
        });

        if (!pengajuan) {
            return res.status(404).send('Pengajuan Magang tidak ditemukan.');
        }

        if (pengajuan.Mahasiswa.dosen_pembimbing_id !== dosenId) {
            return res.status(403).send('Anda tidak memiliki akses ke pengajuan ini.');
        }

        const dokumenRows = await Dokumen.findAll({
            where: { pengajuan_id: pengajuan.id },
            attributes: ['nama_file', 'file_path']
        });

        const mahasiswaData = {
            nama: pengajuan.Mahasiswa.nama,
            nim: pengajuan.Mahasiswa.npm,
            prodi: pengajuan.Mahasiswa.jurusan,
            email: pengajuan.Mahasiswa.User.email,
            telepon: pengajuan.Mahasiswa.no_hp
        };

        const magangData = {
            perusahaan: pengajuan.Lowongan.perusahaan,
            alamat: pengajuan.Lowongan.lokasi,
            posisi: pengajuan.Lowongan.deskripsi.substring(0, Math.min(pengajuan.Lowongan.deskripsi.length, 50)) + '...',
            periode: `${new Date(pengajuan.Lowongan.deadlinependaftaran).toLocaleDateString('id-ID')} s/d ${new Date(new Date(pengajuan.Lowongan.deadlinependaftaran).setMonth(new Date(pengajuan.Lowongan.deadlinependaftaran).getMonth() + parseInt(pengajuan.Lowongan.durasi))).toLocaleDateString('id-ID')}`,
            deskripsi: pengajuan.Lowongan.deskripsi
        };

        const pembimbingLapangan = {
            nama: 'Tidak Tersedia',
            jabatan: 'PIC Perusahaan',
            email: 'Tidak Tersedia',
            telepon: 'Tidak Tersedia'
        };

        const pengajuanStatusData = {
            status: pengajuan.status.replace('_', ' ').toLowerCase().replace(/\b\w/g, s => s.toUpperCase()),
            tanggalVerifikasi: new Date(pengajuan.tanggal_pengajuan).toLocaleDateString('id-ID', {
                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
            }) + ' WIB',
            catatanAdmin: null
        };

        res.render('dospem/detail_pengajuan', {
            title: `Detail Pengajuan Magang - ${mahasiswaData.nama}`,
            mahasiswa: mahasiswaData,
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
    const { search, statusFilter } = req.query; // Ambil parameter search dan statusFilter

    try {
        const dosen = await Dosen.findOne({ where: { user_id: dosenUserId } });
        if (!dosen) {
            console.error('Error: Dosen data not found for user ID:', dosenUserId);
            return res.status(404).send('Data dosen tidak ditemukan.');
        }
        const namaDosen = dosen.nama;
        const dosenId = dosen.id;

        // Ambil semua mahasiswa bimbingan untuk mendapatkan ID dan nama mereka
        const mahasiswaBimbingan = await Mahasiswa.findAll({
            where: { dosen_pembimbing_id: dosenId },
            attributes: ['id', 'nama'] // Pastikan 'nama' disertakan untuk pencarian
        });

        // Filter ID mahasiswa berdasarkan pencarian nama jika ada
        let safeMahasiswaIds = mahasiswaBimbingan.map(mhs => mhs.id);
        if (search) {
            const searchedMahasiswaIds = mahasiswaBimbingan
                .filter(mhs => mhs.nama.toLowerCase().includes(search.toLowerCase()))
                .map(mhs => mhs.id);
            
            // Irisan ID mahasiswa bimbingan dengan ID mahasiswa hasil pencarian
            safeMahasiswaIds = safeMahasiswaIds.filter(id => searchedMahasiswaIds.includes(id));

            // Jika tidak ada mahasiswa yang cocok dengan pencarian, pastikan tidak ada logbook yang dikembalikan
            if (safeMahasiswaIds.length === 0) {
                safeMahasiswaIds = [0]; // Gunakan ID yang tidak mungkin ada untuk mengembalikan hasil kosong
            }
        }

        let whereLogbook = {
            mahasiswa_id: safeMahasiswaIds.length > 0 ? safeMahasiswaIds : [0] // Pastikan array tidak kosong
        };

        if (statusFilter && statusFilter !== '') { // Filter berdasarkan status jika dipilih
            whereLogbook.verifikasi_dosen = (statusFilter === 'sudah dievaluasi');
        }

        const logbooksForEvaluation = await Logbook.findAll({
            where: whereLogbook, // Gunakan objek where yang sudah dibangun secara dinamis
            include: [{ model: Mahasiswa, as: 'Mahasiswa', attributes: ['nama', 'npm'] }],
            order: [['tanggal', 'DESC']]
        });

        const formattedLogbooks = logbooksForEvaluation.map(log => ({
            id: log.id,
            tanggal: log.tanggal,
            deskripsiKegiatan: log.kegiatan,
            judulKegiatan: log.kegiatan.substring(0, Math.min(log.kegiatan.length, 50)) + (log.kegiatan.length > 50 ? '...' : ''),
            statusEvaluasi: log.verifikasi_dosen ? 'sudah dievaluasi' : 'menunggu evaluasi',
            mahasiswaNama: log.Mahasiswa.nama,
            mahasiswaNim: log.Mahasiswa.npm
        }));

        res.render('dospem/evaluasiLogbookList', {
            title: 'Evaluasi Logbook',
            logbooks: formattedLogbooks,
            namaDosen: namaDosen,
            search: search || '',        // Kirim kembali nilai pencarian
            statusFilter: statusFilter || '' // Kirim kembali nilai filter status
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
                    as: 'Mahasiswa',
                    attributes: ['id', 'nama', 'npm', 'dosen_pembimbing_id'],
                    include: [{ model: User, as: 'User', attributes: ['email'] }]
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
            nim: logbook.Mahasiswa.npm
        };

        const pengajuan = await PengajuanMagang.findOne({
            where: { mahasiswa_id: mahasiswaData.id, status: 'diterima' },
            include: [
                {
                    model: Lowongan,
                    as: 'Lowongan',
                    attributes: ['perusahaan', 'deskripsi'],
                }
            ],
            order: [['tanggal_pengajuan', 'DESC']]
        });

        const companyInfo = pengajuan && pengajuan.Lowongan ? {
            namaPerusahaan: pengajuan.Lowongan.perusahaan,
            posisi: pengajuan.Lowongan.deskripsi.substring(0, Math.min(pengajuan.Lowongan.deskripsi.length, 50)) + '...'
        } : null;


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
                fileLampiran: null
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
            include: [{ model: Mahasiswa, as: 'Mahasiswa', attributes: ['dosen_pembimbing_id'] }]
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
            await Feedback.upsert({
                mahasiswa_id: logbook.mahasiswa_id,
                dosen_id: dosenId,
                pesan: komentarDosen,
                tanggal: new Date()
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
                { model: Mahasiswa, as: 'Mahasiswa', attributes: ['nama', 'npm'] },
                { model: Penilaian, as: 'Penilaian', attributes: ['nilai_akhir', 'komentar', 'tanggal'], required: false }
            ],
            order: [['tanggal_upload', 'DESC']]
        });

        const formattedLaporan = await Promise.all(laporanForPenilaian.map(async (lap) => {
            const pengajuan = await PengajuanMagang.findOne({
                where: { mahasiswa_id: lap.mahasiswa_id, status: 'diterima' },
                include: [{
                    model: Lowongan,
                    as: 'Lowongan',
                    attributes: ['perusahaan', 'lokasi', 'durasi', 'deadlinependaftaran', 'deskripsi']
                }],
                order: [['tanggal_pengajuan', 'DESC']]
            });
            const perusahaanMagang = pengajuan && pengajuan.Lowongan
                                     ? pengajuan.Lowongan.perusahaan
                                     : '-';
            return {
                id: lap.id,
                mahasiswaId: lap.mahasiswa_id,
                judul: lap.judul,
                file_path: lap.file_path,
                status: lap.status,
                tanggal_upload: lap.tanggal_upload,
                mahasiswaNama: lap.Mahasiswa.nama,
                mahasiswaNim: lap.Mahasiswa.npm,
                nilai: lap.Penilaian ? lap.Penilaian.nilai_akhir : null,
                komentarDosen: lap.Penilaian ? lap.Penilaian.komentar : null,
                tanggalPenilaian: lap.Penilaian ? lap.Penilaian.tanggal : null,
                statusPenilaian: lap.status,
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
                    as: 'Mahasiswa',
                    attributes: ['id', 'nama', 'npm', 'dosen_pembimbing_id']
                },
                {
                    model: Penilaian,
                    as: 'Penilaian',
                    attributes: ['nilai_akhir', 'komentar'],
                    required: false
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
            nim: laporanAkhir.Mahasiswa.npm
        };

        const pengajuan = await PengajuanMagang.findOne({
            where: { mahasiswa_id: mahasiswaData.id, status: 'diterima' },
            include: [
                {
                    model: Lowongan,
                    as: 'Lowongan',
                    attributes: ['perusahaan', 'deskripsi'],
                }
            ],
            order: [['tanggal_pengajuan', 'DESC']]
        });

        const companyInfo = pengajuan && pengajuan.Lowongan ? {
            namaPerusahaan: pengajuan.Lowongan.perusahaan,
            posisi: pengajuan.Lowongan.deskripsi.substring(0, Math.min(pengajuan.Lowongan.deskripsi.length, 50)) + '...'
        } : null;

        const penilaianKomponen = {
            kinerjaTugas: null,
            feedbackKinerja: '',
            kedisiplinan: null,
            feedbackKedisiplinan: '',
            kolaborasiKomunikasi: null,
            feedbackKolaborasi: '',
        };
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
                nilai: laporanAkhir.Penilaian ? laporanAkhir.Penilaian.nilai_akhir : null,
                komentarDosen: laporanAkhir.Penilaian ? laporanAkhir.Penilaian.komentar : null,
                statusPenilaian: laporanAkhir.status
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
            include: [{ model: Mahasiswa, as: 'Mahasiswa', attributes: ['id', 'dosen_pembimbing_id'] }]
        });

        if (!laporanAkhir) {
            return res.status(404).send('Laporan akhir tidak ditemukan.');
        }

        if (laporanAkhir.Mahasiswa.dosen_pembimbing_id !== dosenId) {
            return res.status(403).send('Anda tidak memiliki akses untuk menilai laporan ini.');
        }

        const combinedKomentar = `Kinerja: ${feedbackKinerjaTugas || '-'} | Kedisiplinan: ${feedbackKedisiplinan || '-'} | Kolaborasi: ${feedbackKolaborasiKomunikasi || '-'}`;

        await Penilaian.upsert({
            mahasiswa_id: laporanAkhir.mahasiswa_id,
            dosen_id: dosenId,
            nilai_akhir: parseFloat(nilaiAkhir),
            komentar: combinedKomentar,
            tanggal: new Date()
        });

        await laporanAkhir.update({ status: 'diterima' });

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