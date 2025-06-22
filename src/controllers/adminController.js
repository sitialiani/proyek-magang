'use strict';
// Impor semua model yang dibutuhkan dari database
const { User, Dosen, Mahasiswa, Lowongan, Perusahaan, PengajuanMagang, Dokumen, Feedback, Backup, Laporan } = require('../../models');
const { Op } = require('sequelize'); // Untuk query yang lebih kompleks
const bcrypt = require('bcrypt'); // Untuk hashing password
const fs = require('fs');
const path = require('path');
const mysqldump = require('mysqldump'); // Ganti 'exec' dengan 'mysqldump'
const dbConfig = require('../../config/config.js')[process.env.NODE_ENV || 'development'];
const { Parser } = require('json2csv'); // Untuk export CSV

// Catatan: Setiap fungsi diekspor secara individual.

/**
 * @desc    Menampilkan halaman dashboard admin.
 * @route   GET /admin/dashboard
 */
exports.getDashboardPage = async (req, res) => {
    try {
        // Query untuk kartu statistik
        const [pengajuanBaru, mahasiswaAktif, perusahaanMitra, dosenPembimbing, tanpaPembimbing] = await Promise.all([
            PengajuanMagang.count({ where: { status: 'diajukan' } }),
            Mahasiswa.count(), // Hapus filter status_magang
            Perusahaan.count(),
            Dosen.count(),
            Mahasiswa.count({ where: { dosen_pembimbing_id: null } })
        ]);

        res.render('dashboard_admin', {
            stats: { pengajuanBaru, mahasiswaAktif, perusahaanMitra, dosenPembimbing, tanpaPembimbing },
            tugas: [], // Data ini bisa diisi dengan query lain
            aktivitas: [] // Data ini bisa diisi dengan query lain
        });
    } catch (error) {
        console.error("Error di getDashboardPage:", error);
        res.status(500).send('Terjadi kesalahan pada server');
    }
};

/**
 * @desc    Menampilkan halaman manajemen pengguna.
 * @route   GET /admin/manajemen-pengguna
 */
exports.getManajemenPenggunaPage = async (req, res) => {
     try {
        const { search, role } = req.query;
        const whereClause = {};

        if (search) {
            whereClause[Op.or] = [
                { username: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } }
            ];
        }

        if (role && role !== 'Semua Peran') {
            const dbRole = role === 'Mahasiswa' ? 'mahasiswa' :
                           role === 'Dosen Pembimbing' ? 'dosen' :
                           role === 'Admin Jurusan' ? 'admin' : null;
            if (dbRole) {
                whereClause.role = dbRole;
            }
        }

        const users = await User.findAll({
            where: whereClause,
            attributes: ['id', 'username', 'email', 'role', 'status', 'created_at'],
            order: [['created_at', 'DESC']]
        });
        
        // Transform data untuk menyesuaikan dengan template EJS
        const transformedUsers = users.map(user => ({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role === 'mahasiswa' ? 'Mahasiswa' : 
                  user.role === 'dosen' ? 'Dosen Pembimbing' : 
                  user.role === 'admin' ? 'Admin Jurusan' : user.role,
            status: user.status || 'Aktif'
        }));
        
        res.render('manajemen_pengguna', { 
            users: transformedUsers,
            currentSearch: search || '',
            currentRole: role || 'Semua Peran'
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Terjadi kesalahan server');
    }
};

/**
 * @desc    Menambahkan pengguna baru.
 * @route   POST /admin/manajemen/pengguna
 */
exports.addUser = async (req, res) => {
    try {
        const { username, email, role, password } = req.body;
        
        // Validasi input
        if (!username || !email || !role || !password) {
            return res.status(400).json({ error: 'Semua field harus diisi' });
        }
        
        // Cek apakah email sudah ada
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email sudah terdaftar' });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Transform role untuk database
        const dbRole = role === 'Mahasiswa' ? 'mahasiswa' : 
                      role === 'Dosen Pembimbing' ? 'dosen' : 
                      role === 'Admin Jurusan' ? 'admin' : role;
        
        // Buat user baru
        const newUser = await User.create({
            username,
            email,
            role: dbRole,
            password: hashedPassword,
            status: 'Aktif'
        });
        
        res.json({ success: true, message: 'Pengguna berhasil ditambahkan', user: newUser });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Gagal menambahkan pengguna' });
    }
};

/**
 * @desc    Mengubah status pengguna (aktif/nonaktif).
 * @route   PUT /admin/manajemen/pengguna/:id/status
 */
exports.updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'Pengguna tidak ditemukan' });
        }
        
        user.status = status;
        await user.save();
        
        res.json({ success: true, message: `Status pengguna berhasil diubah menjadi ${status}` });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Gagal mengubah status pengguna' });
    }
};

/**
 * @desc    Reset password pengguna.
 * @route   PUT /admin/manajemen/pengguna/:id/reset-password
 */
exports.resetUserPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { new_password } = req.body;
        
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'Pengguna tidak ditemukan' });
        }
        
        // Hash password baru
        const hashedPassword = await bcrypt.hash(new_password, 10);
        user.password = hashedPassword;
        await user.save();
        
        res.json({ success: true, message: 'Password berhasil direset' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Gagal reset password' });
    }
};

/**
 * @desc    Mengedit data pengguna.
 * @route   PUT /admin/manajemen/pengguna/:id
 */
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, role } = req.body;
        
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'Pengguna tidak ditemukan' });
        }
        
        // Cek apakah email sudah ada (kecuali untuk user yang sedang diedit)
        if (email !== user.email) {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ error: 'Email sudah terdaftar' });
            }
        }
        
        // Transform role untuk database
        const dbRole = role === 'Mahasiswa' ? 'mahasiswa' : 
                      role === 'Dosen Pembimbing' ? 'dosen' : 
                      role === 'Admin Jurusan' ? 'admin' : role;
        
        user.username = username;
        user.email = email;
        user.role = dbRole;
        await user.save();
        
        res.json({ success: true, message: 'Data pengguna berhasil diupdate' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Gagal mengupdate data pengguna' });
    }
};

/**
 * @desc    Menghapus pengguna.
 * @route   DELETE /admin/manajemen/pengguna/:id
 */
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'Pengguna tidak ditemukan' });
        }
        
        await user.destroy();
        
        res.json({ success: true, message: 'Pengguna berhasil dihapus' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Gagal menghapus pengguna' });
    }
};

/**
 * @desc    Menampilkan halaman manajemen dosen pembimbing.
 * @route   GET /admin/dosen-pembimbing
 */
exports.getDosenPembimbingPage = async (req, res) => {
    try {
        const dosenList = await Dosen.findAll({
            include: [{
                model: Mahasiswa,
                as: 'mahasiswaBimbingan',
                attributes: ['id', 'nim', 'nama'],
                include: [{
                    model: PengajuanMagang,
                    as: 'pengajuanMagangs',
                    where: { status: 'diterima' },
                    required: false,
                    include: [{
                        model: Lowongan,
                        as: 'lowongan'
                    }]
                }]
            }],
            order: [['nama', 'ASC']]
        });
        res.render('dosen_pembimbing', {
            dosenList: dosenList,
            semuaDosen: await Dosen.findAll({ order: [['nama', 'ASC']] }),
            mahasiswaTanpaDosen: await Mahasiswa.findAll({ where: { dosen_pembimbing_id: null } })
        });
    } catch (error) {
        console.error("Error saat mengambil data pembimbingan:", error);
        res.status(500).send('Terjadi kesalahan pada server');
    }
};

/**
 * @desc    Menangani proses alokasi dosen ke mahasiswa.
 * @route   POST /admin/alokasi-pembimbing
 */
exports.alokasikanPembimbing = async (req, res) => {
    try {
        const { mahasiswaId, dosenId } = req.body;
        if (!mahasiswaId || !dosenId) {
            return res.status(400).send('Mahasiswa dan Dosen harus dipilih.');
        }
        const mahasiswa = await Mahasiswa.findByPk(mahasiswaId);
        if (!mahasiswa) {
            return res.status(404).send('Mahasiswa tidak ditemukan.');
        }
        mahasiswa.dosen_pembimbing_id = dosenId;
        await mahasiswa.save();
        res.redirect('/admin/dosen-pembimbing');
    } catch (error) {
        console.error("Error saat mengalokasikan pembimbing:", error);
        res.status(500).send('Terjadi kesalahan pada server');
    }
};

/**
 * @desc    Menampilkan halaman progress magang.
 * @route   GET /admin/progress-magang
 */
exports.getProgressMagangPage = async (req, res) => {
    try {
        const { search, status, dosen, perusahaan } = req.query;

        // --- BUAT KONDISI FILTER DINAMIS UNTUK SEQUELIZE ---
        const whereClause = {
            status: { [Op.or]: ['diterima', 'selesai'] } // Hanya tampilkan yang sudah diterima atau selesai
        };
        const mahasiswaWhereClause = {};
        const lowonganWhereClause = {};
        const dosenWhereClause = {};

        if (search) {
            mahasiswaWhereClause[Op.or] = [
                { nama: { [Op.like]: `%${search}%` } },
                { nim: { [Op.like]: `%${search}%` } }
            ];
        }

        if (status && status !== 'Semua Status Magang') {
            const dbStatus = status === 'Aktif Magang' ? 'diterima' : 'selesai';
            whereClause.status = dbStatus;
        }

        if (perusahaan && perusahaan !== 'Semua Perusahaan') {
            lowonganWhereClause.perusahaan = perusahaan;
        }

        if (dosen && dosen !== 'Semua Dosen') {
            dosenWhereClause.nama = dosen;
        }
        
        // --- QUERY UTAMA DENGAN FILTER (PENDEKATAN LEBIH FLEKSIBEL) ---
        const progressData = await PengajuanMagang.findAll({
            where: whereClause,
            include: [
                {
                    model: Mahasiswa,
                    as: 'mahasiswa',
                    where: mahasiswaWhereClause,
                    required: !!search, // Hanya INNER JOIN jika ada pencarian
                    include: [
                        {
                            model: Dosen,
                            as: 'dosen',
                            where: dosenWhereClause,
                            required: (dosen && dosen !== 'Semua Dosen'),
                            attributes: ['nama', 'nidn']
                        },
                        {
                            model: User,
                            as: 'user',
                            attributes: ['username']
                        }
                    ]
                },
                {
                    model: Lowongan,
                    as: 'lowongan',
                    where: lowonganWhereClause,
                    required: (perusahaan && perusahaan !== 'Semua Perusahaan'), // Hanya INNER JOIN jika ada filter perusahaan
                }
            ],
            order: [['tanggal_pengajuan', 'DESC']]
        });

        // Saring hasil untuk memastikan relasi tidak null (menjaga dari data yang tidak konsisten)
        const validProgressData = progressData.filter(p => p.mahasiswa && p.lowongan);

        // Query untuk data laporan, hanya untuk data yang valid
        const laporanMahasiswaIds = validProgressData.map(p => p.mahasiswa.id);
        const laporanData = await Laporan.findAll({
            where: { mahasiswaId: { [Op.in]: laporanMahasiswaIds } }
        });

        // Gabungkan data progress dengan data laporan
        const combinedData = validProgressData.map(pengajuan => {
            const laporan = laporanData.find(l => l.mahasiswaId === pengajuan.mahasiswa.id);
            
            return {
                id: pengajuan.id,
                nim: pengajuan.mahasiswa.nim,
                nama: pengajuan.mahasiswa.nama,
                perusahaan: pengajuan.lowongan.perusahaan,
                statusMagang: pengajuan.status === 'diterima' ? 'Aktif Magang' : 'Selesai',
                dosenPembimbing: pengajuan.mahasiswa.dosen ? pengajuan.mahasiswa.dosen.nama : 'Belum Dialokasikan',
                logbookStatus: 'Terisi', // Placeholder
                laporanStatus: laporan ? laporan.status : 'Belum Unggah',
                tanggalPengajuan: pengajuan.tanggal_pengajuan
            };
        });

        // --- STATISTIK & DROPDOWN (ini bisa tetap sama) ---
        const [mahasiswaAktif, telahSelesai, semuaDosen, semuaPerusahaan] = await Promise.all([
            PengajuanMagang.count({ where: { status: 'diterima' } }),
            PengajuanMagang.count({ where: { status: 'selesai' } }),
            Dosen.findAll({ attributes: ['nama'], order: [['nama', 'ASC']] }),
            Lowongan.findAll({
                attributes: ['perusahaan'],
                group: ['perusahaan'],
                order: [['perusahaan', 'ASC']]
            })
        ]);

        res.render('progress_magang', {
            progressList: combinedData,
            stats: {
                mahasiswaAktif,
                logbookBelumDiisi: mahasiswaAktif, // Placeholder
                laporanReview: 5, // Placeholder
                telahSelesai
            },
            filters: {
                semuaDosen: semuaDosen.map(d => d.nama),
                semuaPerusahaan: semuaPerusahaan.map(p => p.perusahaan),
                currentSearch: search || '',
                currentStatus: status || 'Semua Status Magang',
                currentDosen: dosen || 'Semua Dosen',
                currentPerusahaan: perusahaan || 'Semua Perusahaan'
            }
        });
    } catch (error) {
        console.error("Error di getProgressMagangPage:", error);
        res.status(500).send('Terjadi kesalahan pada server');
    }
};

/**
 * @desc    Menampilkan halaman manajemen lowongan magang.
 * @route   GET /admin/lowongan-magang
 */
exports.getLowonganMagangPage = async (req, res) => {
    try {
        const lowonganList = await Lowongan.findAll({
            include: [{ model: PengajuanMagang, as: 'pengajuanMagangs', attributes: ['id'] }]
        });
        res.render('lowongan_magang', { lowonganList });
    } catch (error) {
        console.error("Error di getLowonganMagangPage:", error);
        res.status(500).send('Terjadi kesalahan pada server');
    }
};

/**
 * @desc    Menangani pembuatan lowongan baru. (Placeholder)
 * @route   POST /admin/lowongan-magang
 */
exports.buatLowonganMagang = async (req, res) => {
    try {
        // Logika untuk membuat lowongan baru dari req.body
        console.log('Membuat lowongan baru:', req.body);
        // await Lowongan.create({...});
        res.redirect('/admin/lowongan-magang');
    } catch (error) {
        console.error("Error di buatLowonganMagang:", error);
        res.status(500).send('Terjadi kesalahan pada server');
    }
};

/**
 * @desc    Mengubah format bytes menjadi ukuran yang mudah dibaca (KB, MB, GB).
 */
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * @desc    Menampilkan halaman manajemen backup.
 * @route   GET /admin/manajemen-backup
 */
exports.getManajemenBackupPage = async (req, res) => {
    try {
        const backups = await Backup.findAll({
            order: [['created_at', 'DESC']],
        });

        const formattedBackups = backups.map(b => ({
            id: b.id,
            fileName: b.fileName,
            description: b.description,
            createdAt: b.createdAt,
            fileSize: formatBytes(b.fileSize)
        }));

        res.render('manajemen_backup', { backups: formattedBackups });
    } catch (error) {
        console.error('Error fetching backups:', error);
        res.status(500).send('Gagal memuat halaman backup.');
    }
};

/**
 * @desc    Membuat file backup database baru.
 * @route   POST /admin/manajemen-backup/create
 */
exports.createBackup = async (req, res) => {
    const backupDir = path.join(__dirname, '..', '..', 'public', 'backups');
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }

    const fileName = `backup-${Date.now()}.sql`;
    const filePath = path.join(backupDir, fileName);
    const description = req.body.description || 'Backup Otomatis';

    try {
        // Gunakan package mysqldump
        await mysqldump({
            connection: {
                host: dbConfig.host,
                user: dbConfig.username,
                password: dbConfig.password,
                database: dbConfig.database,
            },
            dumpToFile: filePath,
        });

        // Lanjutkan untuk menyimpan info ke database
        const stats = fs.statSync(filePath);
        await Backup.create({
            fileName,
            filePath,
            fileSize: stats.size,
            description,
        });

        res.redirect('/admin/manajemen-backup');

    } catch (error) {
        console.error('Error creating backup:', error);
        res.status(500).send(`Gagal membuat backup: ${error.message}`);
    }
};

/**
 * @desc    Mengunduh file backup.
 * @route   GET /admin/manajemen-backup/:id/download
 */
exports.downloadBackup = async (req, res) => {
    try {
        const backup = await Backup.findByPk(req.params.id);
        if (!backup) {
            return res.status(404).send('File backup tidak ditemukan.');
        }
        res.download(backup.filePath, backup.fileName);
    } catch (error) {
        console.error('Error downloading backup:', error);
        res.status(500).send('Gagal mengunduh file.');
    }
};

/**
 * @desc    Menghapus file backup.
 * @route   POST /admin/manajemen-backup/:id/delete
 */
exports.deleteBackup = async (req, res) => {
    try {
        const backup = await Backup.findByPk(req.params.id);
        if (backup) {
            // Hapus file fisik
            if (fs.existsSync(backup.filePath)) {
                fs.unlinkSync(backup.filePath);
            }
            // Hapus record dari DB
            await backup.destroy();
        }
        res.redirect('/admin/manajemen-backup');
    } catch (error) {
        console.error('Error deleting backup:', error);
        res.status(500).send('Gagal menghapus backup.');
    }
};

/**
 * @desc    Export data progress magang ke CSV.
 * @route   GET /admin/progress-magang/export-csv
 */
exports.exportProgressMagangCSV = async (req, res) => {
    try {
        const { search, status, dosen, perusahaan } = req.query;
        
        // Query untuk mengambil data progress magang dengan semua relasi
        const progressData = await PengajuanMagang.findAll({
            where: {
                status: 'diterima' // Hanya pengajuan yang sudah diterima
            },
            include: [
                {
                    model: Mahasiswa,
                    as: 'mahasiswa',
                    include: [
                        {
                            model: Dosen,
                            as: 'dosen',
                            attributes: ['nama', 'nidn']
                        },
                        {
                            model: User,
                            as: 'user',
                            attributes: ['username']
                        }
                    ]
                },
                {
                    model: Lowongan,
                    as: 'lowongan',
                    include: [
                        {
                            model: Perusahaan,
                            as: 'detailPerusahaan',
                            attributes: ['nama', 'alamat']
                        }
                    ]
                }
            ],
            order: [['tanggal_pengajuan', 'DESC']]
        });

        // Query untuk data laporan
        const laporanData = await Laporan.findAll({
            include: [
                {
                    model: Mahasiswa,
                    as: 'mahasiswa',
                    attributes: ['id', 'nim', 'nama']
                }
            ]
        });

        // Gabungkan data progress dengan data laporan
        const combinedData = progressData
            .filter(pengajuan => pengajuan.mahasiswa && pengajuan.lowongan)
            .map(pengajuan => {
                const mahasiswaId = pengajuan.mahasiswa.id;
                const laporan = laporanData.find(l => l.mahasiswaId === mahasiswaId);
                
                return {
                    NIM: pengajuan.mahasiswa.nim,
                    'Nama Mahasiswa': pengajuan.mahasiswa.nama,
                    'Perusahaan': pengajuan.lowongan.perusahaan,
                    'Status Magang': pengajuan.status === 'diterima' ? 'Aktif Magang' : 
                                    pengajuan.status === 'selesai' ? 'Selesai' : pengajuan.status,
                    'Dosen Pembimbing': pengajuan.mahasiswa.dosen ? pengajuan.mahasiswa.dosen.nama : 'Belum Dialokasikan',
                    'Status Logbook': 'Terisi',
                    'Status Laporan': laporan ? laporan.status : 'Belum Unggah',
                    'Tanggal Pengajuan': pengajuan.tanggal_pengajuan
                };
            });

        // Filter data berdasarkan query parameters
        let filteredData = combinedData;
        
        if (search) {
            filteredData = filteredData.filter(item => 
                item['Nama Mahasiswa'].toLowerCase().includes(search.toLowerCase()) ||
                item.NIM.includes(search)
            );
        }
        
        if (status && status !== 'Semua Status Magang') {
            filteredData = filteredData.filter(item => item['Status Magang'] === status);
        }
        
        if (dosen && dosen !== 'Semua Dosen') {
            filteredData = filteredData.filter(item => item['Dosen Pembimbing'] === dosen);
        }
        
        if (perusahaan && perusahaan !== 'Semua Perusahaan') {
            filteredData = filteredData.filter(item => item['Perusahaan'] === perusahaan);
        }

        // Konfigurasi CSV
        const fields = [
            'NIM', 
            'Nama Mahasiswa', 
            'Perusahaan', 
            'Status Magang', 
            'Dosen Pembimbing', 
            'Status Logbook', 
            'Status Laporan', 
            'Tanggal Pengajuan'
        ];
        
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(filteredData);

        // Set header untuk download
        const filename = `progress-magang-${new Date().toISOString().split('T')[0]}.csv`;
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        
        res.send(csv);
    } catch (error) {
        console.error("Error di exportProgressMagangCSV:", error);
        res.status(500).send('Terjadi kesalahan saat export CSV');
    }
};
