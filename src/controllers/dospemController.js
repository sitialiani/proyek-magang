// src/controllers/dospemController.js

// Impor semua model dari index.js
const db = require('../config/sequelize'); // Ini adalah instance Sequelize
const { Op } = require('sequelize'); // Impor Op untuk operator Sequelize seperti LIKE
const {
    User,
    Mahasiswa,
    Dosen,
    Perusahaan,
    Lowongan,
    PengajuanMagang,
    Dokumen,
    Logbook,
    Laporan,
    Penilaian,
    Feedback
} = require('../../models'); // Ini mengimpor semua model yang sudah didefinisikan relasinya

// Helper untuk mendapatkan data mahasiswa lengkap (termasuk status progres)
const getMahasiswaDetail = async (mhsId) => {
    try {
        const mahasiswa = await Mahasiswa.findByPk(mhsId, {
            include: [
                { model: User, attributes: ['email'] },
                {
                    model: Dosen,
                    as: 'DosenPembimbing',
                    attributes: ['nama']
                }
            ]
        });

        if (!mahasiswa) return null;

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
        const statusLaporanAkhir = laporan ? laporan.status.replace('_', ' ').toLowerCase().replace(/\b\w/g, s => s.toUpperCase()) : 'Belum Unggah';

        // Ambil pengajuan magang yang diterima untuk info perusahaan dan periode (hanya untuk tampilan detail)
        // Ini tidak akan digunakan untuk filter di daftarMahasiswa, melainkan statusPengajuanTerbaru di bawah.
        const pengajuanInfoDiterima = await PengajuanMagang.findOne({
            where: { mahasiswa_id: mahasiswa.id, status: 'diterima' }, // Hanya ambil status 'diterima' untuk perusahaan/periode
            include: [
                {
                    model: Lowongan,
                    attributes: ['perusahaan', 'lokasi', 'durasi', 'deadlinependaftaran', 'deskripsi'],
                }
            ],
            order: [['tanggal_pengajuan', 'DESC']]
        });

        // PENTING: Ambil STATUS PENGAJUAN TERBARU untuk filter di daftarMahasiswa
        const statusPengajuanTerbaruObj = await PengajuanMagang.findOne({
            where: { mahasiswa_id: mahasiswa.id },
            attributes: ['status'],
            order: [['tanggal_pengajuan', 'DESC']] // Ambil status pengajuan terbaru
        });

        // Normalisasi statusMagang ke lowercase tanpa spasi untuk pencocokan filter
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
            statusMagang: statusMagang, // Ini akan digunakan untuk filter status pengajuan
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
    const dosenUserId = req.user.id;

    try {
        const dosen = await Dosen.findOne({ where: { user_id: dosenUserId } });

        if (!dosen) {
            return res.status(404).send('Data dosen tidak ditemukan. Pastikan user_id dosen di tabel users sesuai dengan id user di tabel dosen.');
        }

        const namaDosen = dosen.nama;
        const dosenId = dosen.id;

        const mahasiswaBimbingan = await Mahasiswa.findAll({
            where: { dosen_pembimbing_id: dosenId },
            attributes: ['id', 'nama']
        });

        const totalMahasiswaBimbingan = mahasiswaBimbingan.length;
        const mahasiswaIdsBimbingan = mahasiswaBimbingan.map(mhs => mhs.id);

        const logbookMenungguEvaluasi = await Logbook.count({
            where: {
                mahasiswa_id: mahasiswaIdsBimbingan.length > 0 ? mahasiswaIdsBimbingan : [0],
                verifikasi_dosen: false
            }
        });

        const laporanMenungguPenilaian = await Laporan.count({
            where: {
                mahasiswa_id: mahasiswaIdsBimbingan.length > 0 ? mahasiswaIdsBimbingan : [0],
                status: 'menunggu'
            }
        });

        let aktivitasTerbaru = [];

        // Recent Logbooks (menunggu evaluasi)
        const recentLogbooks = await Logbook.findAll({
            where: {
                mahasiswa_id: mahasiswaIdsBimbingan.length > 0 ? mahasiswaIdsBimbingan : [0],
                verifikasi_dosen: false
            },
            include: [{ model: Mahasiswa, attributes: ['nama'] }],
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
                mahasiswa_id: mahasiswaIdsBimbingan.length > 0 ? mahasiswaIdsBimbingan : [0],
                status: 'menunggu'
            },
            include: [{ model: Mahasiswa, attributes: ['nama'] }],
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
                mahasiswa_id: mahasiswaIdsBimbingan.length > 0 ? mahasiswaIdsBimbingan : [0],
                status: 'diajukan'
            },
            include: [{ model: Mahasiswa, attributes: ['nama'] }],
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
        aktivitasTerbaru = aktivitasTerbaru.slice(0, 5);

        // Calendar Events
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
            return res.status(404).send('Data dosen tidak ditemukan.');
        }
        const namaDosen = dosen.nama;
        const dosenId = dosen.id;

        // Awalnya, dapatkan semua ID mahasiswa bimbingan dosen ini
        let whereMahasiswa = {
            dosen_pembimbing_id: dosenId
        };

        // Jika ada search query, tambahkan kondisi ke pencarian nama mahasiswa
        if (search) {
            whereMahasiswa.nama = { [Op.like]: `%${search}%` };
        }

        const mahasiswaList = await Mahasiswa.findAll({
            where: whereMahasiswa,
            attributes: ['id', 'nama'] // Ambil id dan nama untuk selanjutnya diproses
        });

        let mahasiswaIdsBimbingan = mahasiswaList.map(mhs => mhs.id);

        // Jika tidak ada mahasiswa yang cocok dengan pencarian nama, atau tidak ada mahasiswa bimbingan sama sekali
        if (mahasiswaIdsBimbingan.length === 0) {
            // Kita set id ke [0] agar query Sequelize berikutnya (IN clause) tidak error jika array kosong
            // Ini akan menyebabkan Promise.all mengembalikan null untuk setiap ID 0, yang kemudian akan difilter
            mahasiswaIdsBimbingan = [0];
        }


        // Ambil detail lengkap untuk setiap mahasiswa yang cocok dengan filter nama (atau semua jika tidak ada search)
        const daftarMahasiswaPromises = mahasiswaIdsBimbingan.map(mhsId => getMahasiswaDetail(mhsId));
        let daftarMahasiswa = (await Promise.all(daftarMahasiswaPromises)).filter(mhs => mhs !== null);

        // Filter daftarMahasiswa berdasarkan status pengajuan jika statusFilter diberikan
        if (statusFilter) {
            daftarMahasiswa = daftarMahasiswa.filter(mhs => {
                // 'mhs.statusMagang' sudah dinormalisasi menjadi lowercase tanpa spasi di getMahasiswaDetail
                return mhs.statusMagang === statusFilter;
            });
        }


        res.render('dospem/daftarMahasiswa', {
            title: 'Mahasiswa Bimbingan',
            mahasiswa: daftarMahasiswa,
            namaDosen: namaDosen,
            search: search || '', // Kirim kembali nilai search ke template
            statusFilter: statusFilter || '' // Kirim kembali nilai statusFilter ke template
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

        const logbooks = await Logbook.findAll({
            where: { mahasiswa_id: mahasiswaId },
            order: [['tanggal', 'DESC']]
        });
        const formattedLogbooks = logbooks.map(log => ({
            id: log.id,
            minggu: 'N/A', // Jika tidak ada di DB, Anda bisa menambahkan ini secara manual di tabel logbook
            tanggal: log.tanggal,
            deskripsiKegiatan: log.kegiatan,
            statusEvaluasi: log.verifikasi_dosen ? 'sudah dievaluasi' : 'menunggu evaluasi',
            komentarDosen: '', // Perlu diambil dari tabel Feedback
            judulKegiatan: log.kegiatan.substring(0, Math.min(log.kegiatan.length, 50)) + (log.kegiatan.length > 50 ? '...' : '')
        }));


        const laporanAkhir = await Laporan.findOne({
            where: { mahasiswa_id: mahasiswaId },
            include: [{ model: Penilaian, attributes: ['nilai_akhir', 'komentar'] }] // Include Penilaian
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
                    attributes: ['perusahaan', 'lokasi', 'durasi', 'deadlinependaftaran', 'deskripsi'],
                }
            ],
            order: [['tanggal_pengajuan', 'DESC']]
        });

        const formattedPengajuanMagang = pengajuanMagang.map(peng => ({
            id: peng.id,
            mahasiswaId: peng.mahasiswa_id,
            namaPerusahaan: peng.Lowongan ? peng.Lowongan.perusahaan : '-',
            posisi: peng.Lowongan ? peng.Lowongan.deskripsi.substring(0, Math.min(peng.Lowongan.deskripsi.length, 50)) + '...' : '-',
            tanggalMulai: peng.Lowongan ? new Date(peng.Lowongan.deadlinependaftaran) : null,
            tanggalSelesai: peng.Lowongan ? new Date(new Date(peng.Lowongan.deadlinependaftaran).setMonth(new Date(peng.Lowongan.deadlinependaftaran).getMonth() + parseInt(peng.Lowongan.durasi))) : null,
            dokumenPendukung: '',
            statusPengajuan: peng.status,
            komentarDosen: '',
            surat: '', cv: '', proposal: ''
        }));


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
        res.status(500).send('Terjadi kesalahan saat memuat detail mahasiswa.');
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
                    attributes: ['nama', 'npm', 'jurusan', 'no_hp', 'dosen_pembimbing_id'],
                    include: [{ model: User, attributes: ['email'] }]
                },
                {
                    model: Lowongan,
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
            include: [{ model: Mahasiswa, attributes: ['nama', 'npm'] }],
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
                    attributes: ['nama', 'npm', 'dosen_pembimbing_id'],
                    include: [{ model: User, attributes: ['email'] }]
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
                { model: Mahasiswa, attributes: ['nama', 'npm'] },
                { model: Penilaian, attributes: ['nilai_akhir', 'komentar', 'tanggal'], required: false }
            ],
            order: [['tanggal_upload', 'DESC']]
        });

        const formattedLaporan = await Promise.all(laporanForPenilaian.map(async (lap) => {
            const pengajuan = await PengajuanMagang.findOne({
                where: { mahasiswa_id: lap.mahasiswa_id, status: 'diterima' },
                include: [{
                    model: Lowongan,
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
                    attributes: ['nama', 'npm', 'dosen_pembimbing_id']
                },
                {
                    model: Penilaian,
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
            include: [{ model: Mahasiswa, attributes: ['id', 'dosen_pembimbing_id'] }]
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
