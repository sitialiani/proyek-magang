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
User.hasOne(Dosen, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Dosen.belongsTo(User, { foreignKey: 'user_id' });

// Users & Mahasiswa
User.hasOne(Mahasiswa, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Mahasiswa.belongsTo(User, { foreignKey: 'user_id' });

// Dosen & Mahasiswa (dosen_pembimbing_id)
Dosen.hasMany(Mahasiswa, { foreignKey: 'dosen_pembimbing_id', as: 'MahasiswaBimbingan', onDelete: 'SET NULL' });
Mahasiswa.belongsTo(Dosen, { foreignKey: 'dosen_pembimbing_id', as: 'DosenPembimbing' });

// Mahasiswa, Lowongan & PengajuanMagang
Mahasiswa.hasMany(PengajuanMagang, { foreignKey: 'mahasiswa_id', onDelete: 'CASCADE' });
PengajuanMagang.belongsTo(Mahasiswa, { foreignKey: 'mahasiswa_id' });
Lowongan.hasMany(PengajuanMagang, { foreignKey: 'lowongan_id', onDelete: 'CASCADE' });
PengajuanMagang.belongsTo(Lowongan, { foreignKey: 'lowongan_id' });

// PengajuanMagang & Dokumen
PengajuanMagang.hasMany(Dokumen, { foreignKey: 'pengajuan_id', onDelete: 'CASCADE' });
Dokumen.belongsTo(PengajuanMagang, { foreignKey: 'pengajuan_id' });

// Mahasiswa & Logbook
Mahasiswa.hasMany(Logbook, { foreignKey: 'mahasiswa_id', onDelete: 'CASCADE' });
Logbook.belongsTo(Mahasiswa, { foreignKey: 'mahasiswa_id' });

// Mahasiswa & Laporan (One-to-One)
Mahasiswa.hasOne(Laporan, { foreignKey: 'mahasiswa_id', onDelete: 'CASCADE' });
Laporan.belongsTo(Mahasiswa, { foreignKey: 'mahasiswa_id' });

// Mahasiswa, Dosen & Penilaian (One-to-One Mahasiswa-Penilaian)
Mahasiswa.hasOne(Penilaian, { foreignKey: 'mahasiswa_id', onDelete: 'CASCADE' });
Penilaian.belongsTo(Mahasiswa, { foreignKey: 'mahasiswa_id' });
Dosen.hasMany(Penilaian, { foreignKey: 'dosen_id', onDelete: 'CASCADE' }); // Dosen bisa menilai banyak mahasiswa
Penilaian.belongsTo(Dosen, { foreignKey: 'dosen_id' });

// Users & Notifikasi
User.hasMany(Notifikasi, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Notifikasi.belongsTo(User, { foreignKey: 'user_id' });

// Mahasiswa, Dosen & Feedback
Mahasiswa.hasMany(Feedback, { foreignKey: 'mahasiswa_id', onDelete: 'CASCADE' });
Feedback.belongsTo(Mahasiswa, { foreignKey: 'mahasiswa_id' });
Dosen.hasMany(Feedback, { foreignKey: 'dosen_id', onDelete: 'CASCADE' });
Feedback.belongsTo(Dosen, { foreignKey: 'dosen_id' });

// Mahasiswa & Rekapitulasi (One-to-One)
Mahasiswa.hasOne(Rekapitulasi, { foreignKey: 'mahasiswa_id', onDelete: 'CASCADE' });
Rekapitulasi.belongsTo(Mahasiswa, { foreignKey: 'mahasiswa_id' });

// Users (Admin) & Pengumuman
User.hasMany(Pengumuman, { foreignKey: 'admin_user_id', onDelete: 'SET NULL' });
Pengumuman.belongsTo(User, { foreignKey: 'admin_user_id' });


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