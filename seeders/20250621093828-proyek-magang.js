'use strict';
const bcrypt = require('bcryptjs'); // Pastikan Anda sudah menginstal bcryptjs

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Data untuk tabel 'users'
    const AndiPassword = await bcrypt.hash('andi_password', 10);
    const budiPassword = await bcrypt.hash('budi_password', 10);
    const sitiPassword = await bcrypt.hash('siti_password', 10);

    // Gunakan returning: true untuk mendapatkan ID yang di-generate jika DB Anda mendukung (misalnya PostgreSQL)
    // Untuk MySQL, bulkInsert biasanya tidak mengembalikan ID, jadi kita akan query setelahnya.
    await queryInterface.bulkInsert('users', [{
      username: 'andi',
      password: AndiPassword,
      email: 'andi@gmail.com',
      role: 'dosen',
      created_at: new Date()
    }, {
      username: 'budi',
      password: budiPassword,
      email: 'budi@gmail.com',
      role: 'mahasiswa',
      created_at: new Date()
    }, {
      username: 'aminah',
      password: aminahPassword,
      email: 'aminah@gmail.com',
      role: 'admin',
      created_at: new Date()
    }], { updateOnDuplicate: ['username', 'password', 'email', 'role', 'created_at'] });

    // Dapatkan ID user yang baru saja dibuat
    const [users] = await queryInterface.sequelize.query("SELECT id, username FROM users;");
    const dosenAndiUserId = users.find(u => u.username === 'dosenandi').id;
    const budiSantosoUserId = users.find(u => u.username === 'budi').id;
    const sitiAminahUserId = users.find(u => u.username === 'aminah').id;

    // 2. Data untuk tabel 'dosen'
    await queryInterface.bulkInsert('dosen', [{
      user_id: AndiUserId, // Gunakan ID dinamis
      nama: 'Prof. Dr. Andi Permana',
      nidn: '198001012005011001',
      email: 'andi.permana@example.com',
      telepon: '08123456789'
    }], { updateOnDuplicate: ['user_id', 'nama', 'nidn', 'email', 'telepon'] });

    // Dapatkan ID dosen yang baru saja dibuat
    const [dosen] = await queryInterface.sequelize.query("SELECT id, nama FROM dosen WHERE user_id = " + dosenAndiUserId + ";");
    const dosenAndiId = dosen[0].id; // Hanya ada satu dosen yang kita masukkan di sini

    // 3. Data untuk tabel 'mahasiswa'
    await queryInterface.bulkInsert('mahasiswa', [{
      user_id: budiSUserId, // Gunakan ID dinamis
      dosen_pembimbing_id: AndiId, // Gunakan ID dinamis
      nama: 'Budi Santoso',
      npm: '2022001',
      jurusan: 'Teknik Informatika',
      angkatan: 2022,
      no_hp: '081211122233'
    }, {
      user_id: AminahUserId, // Gunakan ID dinamis
      dosen_pembimbing_id: AndiId, // Gunakan ID dinamis
      nama: 'Siti Aminah',
      npm: '2022002',
      jurusan: 'Sistem Informasi',
      angkatan: 2022,
      no_hp: '081233344455'
    }], { updateOnDuplicate: ['user_id', 'dosen_pembimbing_id', 'nama', 'npm', 'jurusan', 'angkatan', 'no_hp'] });

    // Dapatkan ID mahasiswa yang baru saja dibuat
    const [mahasiswa] = await queryInterface.sequelize.query("SELECT id, npm FROM mahasiswa;");
    const budiMhsId = mahasiswa.find(m => m.npm === '2022001').id;
    const AminahMhsId = mahasiswa.find(m => m.npm === '2022002').id;

    // 4. Data untuk tabel 'perusahaan'
    await queryInterface.bulkInsert('perusahaan', [{
      nama: 'PT. Teknologi Maju',
      alamat: 'Jl. Sudirman No. 10 Jakarta',
      email: 'info@teknologimaju.com',
      telepon: '021-12345678',
      pic: 'Bpk. Rizky Pratama'
    }, {
      nama: 'CV. Solusi Digital',
      alamat: 'Jl. Thamrin No. 5 Bandung',
      email: 'contact@solusidigital.com',
      telepon: '022-98765432',
      pic: 'Ibu. Dewi Lestari'
    }], { updateOnDuplicate: ['nama', 'alamat', 'email', 'telepon', 'pic'] });

    // Dapatkan ID perusahaan yang baru saja dibuat
    const [perusahaan] = await queryInterface.sequelize.query("SELECT id, nama FROM perusahaan;");
    const ptTeknologiMajuId = perusahaan.find(p => p.nama === 'PT. Teknologi Maju').id;
    const cvSolusiDigitalId = perusahaan.find(p => p.nama === 'CV. Solusi Digital').id;

    // 5. Data untuk tabel 'lowongan'
    await queryInterface.bulkInsert('lowongan', [{
      perusahaan_id: ptTeknologiMajuId, // Gunakan ID dinamis
      judul: 'Frontend Developer Intern',
      deskripsi: 'Membangun antarmuka pengguna aplikasi web menggunakan ReactJS.',
      kualifikasi: 'Menguasai HTML, CSS, JavaScript, ReactJS dasar.',
      tanggal_dibuka: '2025-07-01',
      tanggal_ditutup: '2025-10-31'
    }, {
      perusahaan_id: cvSolusiDigitalId, // Gunakan ID dinamis
      judul: 'Backend Developer Intern',
      deskripsi: 'Mengembangkan dan memelihara API RESTful menggunakan Node.js dan Express.',
      kualifikasi: 'Menguasai Node.js, database MySQL, konsep API.',
      tanggal_dibuka: '2025-07-15',
      tanggal_ditutup: '2025-11-15'
    }], { updateOnDuplicate: ['perusahaan_id', 'judul', 'deskripsi', 'kualifikasi', 'tanggal_dibuka', 'tanggal_ditutup'] });

    // Dapatkan ID lowongan yang baru saja dibuat
    const [lowongan] = await queryInterface.sequelize.query("SELECT id, judul FROM lowongan;");
    const frontendLowonganId = lowongan.find(l => l.judul === 'Frontend Developer Intern').id;
    const backendLowonganId = lowongan.find(l => l.judul === 'Backend Developer Intern').id;

    // 6. Data untuk tabel 'pengajuan_magang'
    await queryInterface.bulkInsert('pengajuan_magang', [{
      mahasiswa_id: budiMhsId, // Gunakan ID dinamis
      lowongan_id: frontendLowonganId, // Gunakan ID dinamis
      tanggal_pengajuan: '2025-06-10',
      status: 'diterima'
    }, {
      mahasiswa_id: AminahMhsId, // Gunakan ID dinamis
      lowongan_id: backendLowonganId, // Gunakan ID dinamis
      tanggal_pengajuan: '2025-06-12',
      status: 'diajukan'
    }, {
      mahasiswa_id: budiMhsId, // Gunakan ID dinamis
      lowongan_id: backendLowonganId, // Gunakan ID dinamis
      tanggal_pengajuan: '2025-05-01',
      status: 'ditolak'
    }], { updateOnDuplicate: ['mahasiswa_id', 'lowongan_id', 'tanggal_pengajuan', 'status'] });

    // Dapatkan ID pengajuan_magang yang baru saja dibuat
    const [pengajuanMagang] = await queryInterface.sequelize.query("SELECT id, mahasiswa_id, lowongan_id FROM pengajuan_magang;");
    const pengajuanBudiFrontendId = pengajuanMagang.find(pm => pm.mahasiswa_id === budiMhsId && pm.lowongan_id === frontendLowonganId).id;
    const pengajuanSitiBackendId = pengajuanMagang.find(pm => pm.mahasiswa_id === AminahMhsId && pm.lowongan_id === backendLowonganId).id;
    // const pengajuanBudiBackendId = pengajuanMagang.find(pm => pm.mahasiswa_id === budiSantosoMhsId && pm.lowongan_id === backendLowonganId && pm.status === 'ditolak').id; // Jika perlu spesifik

    // 7. Data untuk tabel 'dokumen'
    await queryInterface.bulkInsert('dokumen', [{
      pengajuan_id: pengajuanBudiFrontendId, // Gunakan ID dinamis
      nama_file: 'Surat Penerimaan Budi Santoso.pdf',
      jenis: 'surat',
      file_path: '/docs/surat_budi_pm.pdf',
      tanggal_upload: '2025-06-11 09:00:00'
    }, {
      pengajuan_id: pengajuanBudiFrontendId, // Gunakan ID dinamis
      nama_file: 'CV Budi Santoso.pdf',
      jenis: 'CV',
      file_path: '/docs/cv_budi.pdf',
      tanggal_upload: '2025-06-09 14:30:00'
    }, {
      pengajuan_id: pengajuanSitiBackendId, // Gunakan ID dinamis
      nama_file: 'Proposal Magang Siti Aminah.pdf',
      jenis: 'proposal',
      file_path: '/docs/proposal_siti.pdf',
      tanggal_upload: '2025-06-12 16:00:00'
    }], { updateOnDuplicate: ['pengajuan_id', 'nama_file', 'jenis', 'file_path', 'tanggal_upload'] });

    // 8. Data untuk tabel 'logbook'
    await queryInterface.bulkInsert('logbook', [{
      mahasiswa_id: budiMhsId, // Gunakan ID dinamis
      tanggal: '2025-07-01',
      kegiatan: 'Hari pertama orientasi perusahaan dan pengenalan tim.',
      verifikasi_dosen: true
    }, {
      mahasiswa_id: budiMhsId, // Gunakan ID dinamis
      tanggal: '2025-07-08',
      kegiatan: 'Mulai mengerjakan modul otentikasi, belajar konfigurasi API.',
      verifikasi_dosen: false
    }, {
      mahasiswa_id: AminahMhsId, // Gunakan ID dinamis
      tanggal: '2025-07-15',
      kegiatan: 'Mempelajari arsitektur database proyek inventaris.',
      verifikasi_dosen: true
    }, {
      mahasiswa_id: AminahMhsId, // Gunakan ID dinamis
      tanggal: '2025-07-22',
      kegiatan: 'Melakukan debugging pada endpoint laporan stok.',
      verifikasi_dosen: false
    }], { updateOnDuplicate: ['mahasiswa_id', 'tanggal', 'kegiatan', 'verifikasi_dosen'] });

    // 9. Data untuk tabel 'laporan'
    await queryInterface.bulkInsert('laporan', [{
      mahasiswa_id: budiMhsId, // Gunakan ID dinamis
      judul: 'Pengembangan Antarmuka Pengguna E-Commerce dengan ReactJS',
      file_path: '/files/laporan/budi_final_report.pdf',
      status: 'menunggu',
      tanggal_upload: '2025-09-30 10:00:00'
    }, {
      mahasiswa_id: AminahMhsId, // Gunakan ID dinamis
      judul: 'Implementasi API Restful untuk Sistem Manajemen Inventaris',
      file_path: '/files/laporan/siti_final_report.pdf',
      status: 'belum dikumpulkan',
      tanggal_upload: '2025-10-05 11:30:00'
    }], { updateOnDuplicate: ['mahasiswa_id', 'judul', 'file_path', 'status', 'tanggal_upload'] });

    // 10. Data untuk tabel 'penilaian'
    await queryInterface.bulkInsert('penilaian', [{
      mahasiswa_id: budiMhsId, // Gunakan ID dinamis
      dosen_id: AndiId, // Gunakan ID dinamis
      nilai_akhir: null,
      komentar: null,
      tanggal: new Date()
    }], { updateOnDuplicate: ['mahasiswa_id', 'dosen_id', 'nilai_akhir', 'komentar', 'tanggal'] });

    // 11. Data untuk tabel 'feedback'
    await queryInterface.bulkInsert('feedback', [{
      mahasiswa_id: budiMhsId, // Gunakan ID dinamis
      dosen_id: AndiId, // Gunakan ID dinamis
      pesan: 'Perkembangan logbook minggu pertama sangat baik, teruskan!',
      tanggal: new Date()
    }, {
      mahasiswa_id: AminahMhsId, // Gunakan ID dinamis
      dosen_id: AndiId, // Gunakan ID dinamis
      pesan: 'Pastikan mencatat setiap detail kegiatan agar mudah dilacak.',
      tanggal: new Date()
    }], { updateOnDuplicate: ['mahasiswa_id', 'dosen_id', 'pesan', 'tanggal'] });

    // 14. Data untuk tabel 'pengumuman'
    // Diasumsikan user_id 1 adalah admin (dari tabel users)
    const adminUserId = users.find(u => u.role === 'admin')?.id || AndiUserId; // Coba cari admin, fallback ke dosenAndi jika admin belum di-seed atau id-nya beda
    // Jika Anda punya user dengan role 'admin' di users, pastikan id-nya digunakan di sini.
    // Untuk contoh ini, saya asumsikan dosenAndiUserId juga bisa digunakan sebagai admin_user_id jika role-nya 'dosen'.
    // Atau Anda bisa menambahkan user dengan role 'admin' secara eksplisit di user seeder.
    // Jika tidak ada user admin yang khusus, dan role 'dosen' bisa membuat pengumuman, ini bisa dipakai.

    await queryInterface.bulkInsert('pengumuman', [{
      admin_user_id: adminUserId, // Gunakan ID dinamis
      judul: 'Jadwal Batas Akhir Unggah Laporan',
      isi: 'Batas akhir pengunggahan laporan akhir magang adalah 30 September 2025.',
      tanggal: new Date(),
      ditujukan_kepada: 'mahasiswa'
    }, {
      admin_user_id: adminUserId, // Gunakan ID dinamis
      judul: 'Pembekalan Dosen Pembimbing',
      isi: 'Akan ada pembekalan untuk dosen pembimbing pada tanggal 25 Juni 2025.',
      tanggal: new Date(),
      ditujukan_kepada: 'dosen'
    }], { updateOnDuplicate: ['admin_user_id', 'judul', 'isi', 'tanggal', 'ditujukan_kepada'] });

    // 15. Data untuk tabel 'rekapitulasi'
    // ... (sesuaikan jika Anda punya data rekapitulasi yang akan di-seed)
    // Ingat untuk menggunakan ID dinamis dari mahasiswa jika Anda menyertakannya.
  },

  down: async (queryInterface, Sequelize) => {
    // Hapus semua data yang dimasukkan di atas. Urutan PENTING! Kebalikan dari urutan INSERT.
    await queryInterface.bulkDelete('pengumuman', {}, {});
    await queryInterface.bulkDelete('feedback', {}, {});
    await queryInterface.bulkDelete('penilaian', {}, {});
    await queryInterface.bulkDelete('laporan', {}, {});
    await queryInterface.bulkDelete('logbook', {}, {});
    await queryInterface.bulkDelete('dokumen', {}, {});
    await queryInterface.bulkDelete('pengajuan_magang', {}, {});
    await queryInterface.bulkDelete('lowongan', {}, {});
    await queryInterface.bulkDelete('perusahaan', {}, {});
    await queryInterface.bulkDelete('mahasiswa', {}, {});
    await queryInterface.bulkDelete('dosen', {}, {});
    await queryInterface.bulkDelete('users', {}, {});
  }
};