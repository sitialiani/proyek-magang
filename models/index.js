// src/models/index.js
const sequelize = require('../src/config/sequelize');
const User = require('./user');
const Mahasiswa = require('./mahasiswa');
const Dosen = require('./dosen');
const Perusahaan = require('./perusahaan');
const Lowongan = require('./lowongan');
const PengajuanMagang = require('./pengajuanMagang');
const Dokumen = require('./dokumen');
const Logbook = require('./logbook');
const Laporan = require('./laporan');
const Penilaian = require('./penilaian');
const Notifikasi = require('./notifikasi');
const Feedback = require('./feedback');
const TemplateDokumen = require('./templateDokumen');
const Pengumuman = require('./pengumuman');
const Rekapitulasi = require('./rekapitulasi');


// Definisikan Relasi

// Users & Dosen
User.hasOne(Dosen, { foreignKey: 'user_id', onDelete: 'CASCADE', as: 'Dosen' });
Dosen.belongsTo(User, { foreignKey: 'user_id', as: 'User' });

// Users & Mahasiswa
User.hasOne(Mahasiswa, { foreignKey: 'user_id', onDelete: 'CASCADE', as: 'Mahasiswa' });
Mahasiswa.belongsTo(User, { foreignKey: 'user_id', as: 'User' });

// Dosen & Mahasiswa (dosen_pembimbing_id)
Dosen.hasMany(Mahasiswa, { foreignKey: 'dosen_pembimbing_id', as: 'MahasiswaBimbingan', onDelete: 'SET NULL' });
Mahasiswa.belongsTo(Dosen, { foreignKey: 'dosen_pembimbing_id', as: 'DosenPembimbing' });

// Mahasiswa & Logbook
Mahasiswa.hasMany(Logbook, { foreignKey: 'mahasiswa_id', onDelete: 'CASCADE', as: 'Logbooks' });
Logbook.belongsTo(Mahasiswa, { foreignKey: 'mahasiswa_id', as: 'Mahasiswa' });

// Mahasiswa & Laporan (One-to-One)
Mahasiswa.hasOne(Laporan, { foreignKey: 'mahasiswa_id', onDelete: 'CASCADE', as: 'Laporan' });
Laporan.belongsTo(Mahasiswa, { foreignKey: 'mahasiswa_id', as: 'Mahasiswa' });

// Mahasiswa, Lowongan & PengajuanMagang
Mahasiswa.hasMany(PengajuanMagang, { foreignKey: 'mahasiswa_id', onDelete: 'CASCADE', as: 'PengajuanMagang' });
PengajuanMagang.belongsTo(Mahasiswa, { foreignKey: 'mahasiswa_id', as: 'Mahasiswa' });
Lowongan.hasMany(PengajuanMagang, { foreignKey: 'lowongan_id', onDelete: 'CASCADE', as: 'PengajuanMagang' });
PengajuanMagang.belongsTo(Lowongan, { foreignKey: 'lowongan_id', as: 'Lowongan' });

// PengajuanMagang & Dokumen
PengajuanMagang.hasMany(Dokumen, { foreignKey: 'pengajuan_id', onDelete: 'CASCADE', as: 'Dokumen' });
Dokumen.belongsTo(PengajuanMagang, { foreignKey: 'pengajuan_id', as: 'PengajuanMagang' });


// --- ASOSIASI YANG DITAMBAHKAN/DIPERBAIKI UNTUK LAPORAN DAN PENILAIAN ---
// Laporan dan Penilaian (One-to-One) - Sebuah Laporan memiliki satu Penilaian
// Foreign key 'laporan_id' harus ada di tabel 'penilaian'
Laporan.hasOne(Penilaian, { foreignKey: 'laporan_id', as: 'Penilaian' }); 
Penilaian.belongsTo(Laporan, { foreignKey: 'laporan_id', as: 'Laporan' }); 

// Mahasiswa, Dosen & Penilaian
Mahasiswa.hasMany(Penilaian, { foreignKey: 'mahasiswa_id', as: 'Penilaian' });
Penilaian.belongsTo(Mahasiswa, { foreignKey: 'mahasiswa_id', as: 'Mahasiswa' });
Dosen.hasMany(Penilaian, { foreignKey: 'dosen_id', as: 'Penilaian' }); 
Penilaian.belongsTo(Dosen, { foreignKey: 'dosen_id', as: 'Dosen' });

// User dan Notifikasi
User.hasMany(Notifikasi, { foreignKey: 'user_id', onDelete: 'CASCADE', as: 'Notifikasi' });
Notifikasi.belongsTo(User, { foreignKey: 'user_id', as: 'User' });

// Mahasiswa, Dosen & Feedback
Mahasiswa.hasMany(Feedback, { foreignKey: 'mahasiswa_id', onDelete: 'CASCADE', as: 'Feedback' });
Feedback.belongsTo(Mahasiswa, { foreignKey: 'mahasiswa_id', as: 'Mahasiswa' });
Dosen.hasMany(Feedback, { foreignKey: 'dosen_id', onDelete: 'CASCADE', as: 'Feedback' });
Feedback.belongsTo(Dosen, { foreignKey: 'dosen_id', as: 'Dosen' });

// Mahasiswa & Rekapitulasi (One-to-One)
Mahasiswa.hasOne(Rekapitulasi, { foreignKey: 'mahasiswa_id', onDelete: 'CASCADE', as: 'Rekapitulasi' });
Rekapitulasi.belongsTo(Mahasiswa, { foreignKey: 'mahasiswa_id', as: 'Mahasiswa' });

// User (Admin) & Pengumuman
User.hasMany(Pengumuman, { foreignKey: 'admin_user_id', onDelete: 'SET NULL', as: 'Pengumuman' });
Pengumuman.belongsTo(User, { foreignKey: 'admin_user_id', as: 'Admin' });

// Asosiasi antara Dokumen dan TemplateDokumen (jika dokumen merujuk template)
// Jika dokumen punya template_id
// db.TemplateDokumen.hasMany(db.Dokumen, { foreignKey: 'template_id', as: 'Dokumen' });
// db.Dokumen.belongsTo(db.TemplateDokumen, { foreignKey: 'template_id', as: 'TemplateDokumen' });


// Ekspor semua model dan instance sequelize
module.exports = {
    sequelize,
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
    Notifikasi,
    Feedback,
    TemplateDokumen,
    Pengumuman,
    Rekapitulasi
};
