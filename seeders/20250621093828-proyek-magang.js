'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Data untuk tabel 'users' - ID akan di-generate otomatis oleh DB
    const AndiPassword = await bcrypt.hash('andi_password', 10);
    const budiPassword = await bcrypt.hash('budi_password', 10);
    const AminahPassword = await bcrypt.hash('aminah_password', 10);
    const DinaPassword = await bcrypt.hash('dina_password', 10);
    const FajarPassword = await bcrypt.hash('fajar_password', 10);

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
      password: AminahPassword,
      email: 'aminah@gmail.com',
      role: 'mahasiswa', // Aminah sekarang mahasiswa
      created_at: new Date()
    }, {
      username: 'dina',
      password: DinaPassword,
      email: 'dina@gmail.com',
      role: 'mahasiswa',
      created_at: new Date()
    }, {
      username: 'fajar',
      password: FajarPassword,
      email: 'fajar@gmail.com',
      role: 'mahasiswa',
      created_at: new Date()
    }], { updateOnDuplicate: ['username', 'password', 'email', 'role', 'created_at'] });

    // Dapatkan ID user yang baru saja dibuat secara dinamis
    const [users] = await queryInterface.sequelize.query("SELECT id, username, role FROM users;");
    const AndiUserId = users.find(u => u.username === 'andi' && u.role === 'dosen').id;
    const budiUserId = users.find(u => u.username === 'budi' && u.role === 'mahasiswa').id;
    const AminahUserId = users.find(u => u.username === 'aminah' && u.role === 'mahasiswa').id;
    const DinaUserId = users.find(u => u.username === 'dina' && u.role === 'mahasiswa').id;
    const FajarUserId = users.find(u => u.username === 'fajar' && u.role === 'mahasiswa').id;


    // 2. Data untuk tabel 'dosen'
    await queryInterface.bulkInsert('dosen', [{
      user_id: AndiUserId,
      nama: 'Prof. Dr. Andi Permana',
      nidn: '198001012005011001',
      email: 'andi.permana@example.com',
      telepon: '08123456789'
    }], { updateOnDuplicate: ['user_id', 'nama', 'nidn', 'email', 'telepon'] });

    // Dapatkan ID dosen yang baru saja dibuat secara dinamis
    const [dosen] = await queryInterface.sequelize.query(`SELECT id, nama FROM dosen WHERE user_id = ${AndiUserId};`);
    const AndiId = dosen[0].id;


    // 3. Data untuk tabel 'mahasiswa'
    await queryInterface.bulkInsert('mahasiswa', [{
      user_id: budiUserId,
      dosen_pembimbing_id: AndiId,
      nama: 'Budi Santoso',
      npm: '2022001',
      jurusan: 'Teknik Informatika',
      angkatan: 2022,
      no_hp: '081211122233'
    }, {
      user_id: AminahUserId,
      dosen_pembimbing_id: AndiId,
      nama: 'Siti Aminah',
      npm: '2022002',
      jurusan: 'Sistem Informasi',
      angkatan: 2022,
      no_hp: '081233344455'
    }, {
      user_id: DinaUserId,
      dosen_pembimbing_id: AndiId,
      nama: 'Dina Permata',
      npm: '2022003',
      jurusan: 'Teknik Komputer',
      angkatan: 2022,
      no_hp: '081244455566'
    }, {
      user_id: FajarUserId,
      dosen_pembimbing_id: AndiId,
      nama: 'Fajar Kurniawan',
      npm: '2022004',
      jurusan: 'Teknik Informatika',
      angkatan: 2022,
      no_hp: '081255566677'
    }], { updateOnDuplicate: ['user_id', 'dosen_pembimbing_id', 'nama', 'npm', 'jurusan', 'angkatan', 'no_hp'] });

    // Dapatkan ID mahasiswa yang baru saja dibuat secara dinamis
    const [mahasiswa] = await queryInterface.sequelize.query("SELECT id, npm FROM mahasiswa;");
    const budiMhsId = mahasiswa.find(m => m.npm === '2022001').id;
    const AminahMhsId = mahasiswa.find(m => m.npm === '2022002').id;
    const DinaMhsId = mahasiswa.find(m => m.npm === '2022003').id;
    const FajarMhsId = mahasiswa.find(m => m.npm === '2022004').id;


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

    // Dapatkan ID perusahaan yang baru saja dibuat secara dinamis
    const [perusahaan] = await queryInterface.sequelize.query("SELECT id, nama FROM perusahaan;");
    const ptTeknologiMajuId = perusahaan.find(p => p.nama === 'PT. Teknologi Maju').id;
    const cvSolusiDigitalId = perusahaan.find(p => p.nama === 'CV. Solusi Digital').id;


    // 5. Data untuk tabel 'lowongan'
    await queryInterface.bulkInsert('lowongan', [{
      perusahaan_id: ptTeknologiMajuId,
      judul: 'Frontend Developer',
      lokasi: 'Jakarta',
      durasi: '3 Bulan',
      deadlinependaftaran: '2025-10-31',
      deskripsi: 'Membangun antarmuka pengguna aplikasi web menggunakan ReactJS.',
      kualifikasi: 'Menguasai ReactJS dan CSS',
      tanggal_dibuka: '2025-09-01',
      tanggal_ditutup: '2025-10-31',
      link_berkas: null
    }, {
      perusahaan_id: cvSolusiDigitalId,
      judul: 'Backend Developer',
      lokasi: 'Bandung',
      durasi: '6 Bulan',
      deadlinependaftaran: '2025-11-15',
      deskripsi: 'Mengembangkan dan memelihara API RESTful menggunakan Node.js dan Express.',
      kualifikasi: 'Menguasai Node.js dan Express',
      tanggal_dibuka: '2025-10-01',
      tanggal_ditutup: '2025-11-15',
      link_berkas: null
    }], {
      updateOnDuplicate: ['perusahaan_id', 'judul', 'lokasi', 'durasi', 'deadlinependaftaran', 'deskripsi', 'kualifikasi', 'tanggal_dibuka', 'tanggal_ditutup', 'link_berkas']
    });

    // Dapatkan ID lowongan yang baru saja dibuat secara dinamis
    const [lowongan] = await queryInterface.sequelize.query("SELECT id, perusahaan_id, deskripsi FROM lowongan;");
    const frontendLowonganId = lowongan.find(l => l.perusahaan_id === ptTeknologiMajuId && l.deskripsi.includes('ReactJS')).id;
    const backendLowonganId = lowongan.find(l => l.perusahaan_id === cvSolusiDigitalId && l.deskripsi.includes('Node.js')).id;


    // 6. Data untuk tabel 'pengajuan_magang'
    await queryInterface.bulkInsert('pengajuan_magang', [{
      // Budi: Magang Diterima
      mahasiswa_id: budiMhsId,
      lowongan_id: frontendLowonganId,
      tanggal_pengajuan: '2025-06-10', // Ini pengajuan yang diterima
      status: 'diterima',
      cv: '/files/cv/budi_cv.pdf',
      transkrip: '/files/transkrip/budi_transkrip.pdf',
      krs: '/files/krs/budi_krs.pdf',
      dokumen_pendukung: '/files/dokumen/budi_sertifikat.pdf',
      verifikasi: 'diverifikasi',
      keterangan: 'Pengajuan diterima'
    }, {
      // Aminah: Magang Diterima (Pengajuan terbaru Aminah)
      mahasiswa_id: AminahMhsId,
      lowongan_id: backendLowonganId,
      tanggal_pengajuan: '2025-06-20', // Tanggal lebih baru dari yang sebelumnya 'diajukan'
      status: 'diterima',
      cv: '/files/cv/aminah_cv.pdf',
      transkrip: '/files/transkrip/aminah_transkrip.pdf',
      krs: '/files/krs/aminah_krs.pdf',
      dokumen_pendukung: null,
      verifikasi: 'diverifikasi',
      keterangan: 'Pengajuan diterima'
    }, {
      // Pengajuan lama Budi (ditolak) - pastikan tanggal lebih lama dari yang diterima
      mahasiswa_id: budiMhsId,
      lowongan_id: backendLowonganId,
      tanggal_pengajuan: '2025-05-01',
      status: 'ditolak',
      cv: '/files/cv/budi_cv_old.pdf',
      transkrip: '/files/transkrip/budi_transkrip_old.pdf',
      krs: '/files/krs/budi_krs_old.pdf',
      dokumen_pendukung: null,
      verifikasi: 'ditolak',
      keterangan: 'Kuota sudah penuh'
    }, {
      // Pengajuan lama Aminah (diajukan) - pastikan tanggal lebih lama dari yang diterima
      mahasiswa_id: AminahMhsId,
      lowongan_id: frontendLowonganId,
      tanggal_pengajuan: '2025-06-12',
      status: 'diajukan',
      cv: '/files/cv/aminah_cv_old.pdf',
      transkrip: '/files/transkrip/aminah_transkrip_old.pdf',
      krs: '/files/krs/aminah_krs_old.pdf',
      dokumen_pendukung: null,
      verifikasi: 'menunggu',
      keterangan: 'Sedang dalam proses review'
    }, {
      // Dina: Magang Ditolak (Pengajuan terbaru Dina)
      mahasiswa_id: DinaMhsId,
      lowongan_id: frontendLowonganId,
      tanggal_pengajuan: '2025-07-01',
      status: 'ditolak',
      cv: '/files/cv/dina_cv.pdf',
      transkrip: '/files/transkrip/dina_transkrip.pdf',
      krs: '/files/krs/dina_krs.pdf',
      dokumen_pendukung: null,
      verifikasi: 'ditolak',
      keterangan: 'Tidak memenuhi kualifikasi'
    }, {
      // Fajar: Magang Diajukan (Pengajuan terbaru Fajar)
      mahasiswa_id: FajarMhsId,
      lowongan_id: backendLowonganId,
      tanggal_pengajuan: '2025-07-05',
      status: 'diajukan',
      cv: '/files/cv/fajar_cv.pdf',
      transkrip: '/files/transkrip/fajar_transkrip.pdf',
      krs: '/files/krs/fajar_krs.pdf',
      dokumen_pendukung: '/files/dokumen/fajar_portfolio.pdf',
      verifikasi: 'menunggu',
      keterangan: 'Sedang dalam proses review'
    }], { updateOnDuplicate: ['mahasiswa_id', 'lowongan_id', 'tanggal_pengajuan', 'status', 'cv', 'transkrip', 'krs', 'dokumen_pendukung', 'verifikasi', 'keterangan'] });

    // Dapatkan ID pengajuan_magang yang baru saja dibuat secara dinamis
    // Perlu mendapatkan ID pengajuan yang spesifik jika akan digunakan untuk dokumen
    const [pengajuanMagang] = await queryInterface.sequelize.query("SELECT id, mahasiswa_id, lowongan_id, status FROM pengajuan_magang;");
    const pengajuanBudiDiterimaId = pengajuanMagang.find(pm => pm.mahasiswa_id === budiMhsId && pm.status === 'diterima').id;
    const pengajuanAminahDiterimaId = pengajuanMagang.find(pm => pm.mahasiswa_id === AminahMhsId && pm.status === 'diterima').id;
    const pengajuanFajarDiajukanId = pengajuanMagang.find(pm => pm.mahasiswa_id === FajarMhsId && pm.status === 'diajukan').id;
    const pengajuanDinaDitolakId = pengajuanMagang.find(pm => pm.mahasiswa_id === DinaMhsId && pm.status === 'ditolak').id;


    // 7. Data untuk tabel 'dokumen'
    // Dokumen hanya untuk pengajuan yang diterima/diajukan yang relevan
    await queryInterface.bulkInsert('dokumen', [{
      // Dokumen Budi (Pengajuan Diterima)
      pengajuan_id: pengajuanBudiDiterimaId,
      nama_file: 'Surat Penerimaan Budi Santoso.pdf',
      jenis: 'surat',
      file_path: '/docs/surat_budi_pm.pdf',
      tanggal_upload: '2025-06-11 09:00:00'
    }, {
      // Dokumen Budi (Pengajuan Diterima)
      pengajuan_id: pengajuanBudiDiterimaId,
      nama_file: 'CV Budi Santoso.pdf',
      jenis: 'CV',
      file_path: '/docs/cv_budi.pdf',
      tanggal_upload: '2025-06-09 14:30:00'
    }, {
      // Dokumen Aminah (Pengajuan Diterima)
      pengajuan_id: pengajuanAminahDiterimaId,
      nama_file: 'Surat Penerimaan Siti Aminah.pdf',
      jenis: 'surat',
      file_path: '/docs/surat_siti_pm.pdf',
      tanggal_upload: '2025-06-21 10:00:00'
    }, {
      // Dokumen Fajar (Pengajuan Diajukan)
      pengajuan_id: pengajuanFajarDiajukanId,
      nama_file: 'Proposal Magang Fajar.pdf',
      jenis: 'proposal',
      file_path: '/docs/proposal_fajar.pdf',
      tanggal_upload: '2025-07-06 11:00:00'
    }], { updateOnDuplicate: ['pengajuan_id', 'nama_file', 'jenis', 'file_path', 'tanggal_upload'] });

    // 8. Data untuk tabel 'logbook'
    await queryInterface.bulkInsert('logbook', [{
      // Logbook Budi - Evaluasi TRUE
      mahasiswa_id: budiMhsId,
      tanggal: '2025-07-01',
      kegiatan: 'Hari pertama orientasi perusahaan dan pengenalan tim.',
      verifikasi_dosen: true
    }, {
      // Logbook Budi - Evaluasi TRUE
      mahasiswa_id: budiMhsId,
      tanggal: '2025-07-08',
      kegiatan: 'Mulai mengerjakan modul otentikasi, belajar konfigurasi API.',
      verifikasi_dosen: true
    }, {
      // Logbook Aminah - Evaluasi TRUE
      mahasiswa_id: AminahMhsId,
      tanggal: '2025-07-15',
      kegiatan: 'Mempelajari arsitektur database proyek inventaris.',
      verifikasi_dosen: true
    }, {
      // Logbook Aminah - Evaluasi FALSE (Belum dievaluasi salah satu)
      mahasiswa_id: AminahMhsId,
      tanggal: '2025-07-22',
      kegiatan: 'Melakukan debugging pada endpoint laporan stok.',
      verifikasi_dosen: false
    }], { updateOnDuplicate: ['mahasiswa_id', 'tanggal', 'kegiatan', 'verifikasi_dosen'] });

    // 9. Data untuk tabel 'laporan'
    await queryInterface.bulkInsert('laporan', [{
      // Laporan Budi - Status diterima (sudah dinilai)
      mahasiswa_id: budiMhsId,
      judul: 'Pengembangan Antarmuka Pengguna E-Commerce dengan ReactJS',
      file_path: '/files/laporan/budi_final_report.pdf',
      status: 'diterima', // Sudah diterima, berarti sudah dinilai
      tanggal_upload: '2025-09-30 10:00:00'
    }, {
      // Laporan Aminah - Status belum dikumpulkan (belum dinilai)
      mahasiswa_id: AminahMhsId,
      judul: 'Implementasi API Restful untuk Sistem Manajemen Inventaris',
      file_path: '/files/laporan/siti_final_report.pdf',
      status: 'belum dikumpulkan',
      tanggal_upload: '2025-10-05 11:30:00'
    }], { updateOnDuplicate: ['mahasiswa_id', 'judul', 'file_path', 'status', 'tanggal_upload'] });

    // 10. Data untuk tabel 'penilaian'
    await queryInterface.bulkInsert('penilaian', [{
      // Penilaian Budi (karena laporannya sudah diterima/dinilai)
      mahasiswa_id: budiMhsId,
      dosen_id: AndiId,
      nilai_akhir: 88.5,
      komentar: 'Kinerja: Sangat baik | Kedisiplinan: Sangat baik | Kolaborasi: Baik sekali',
      tanggal: new Date('2025-10-10')
    }], { updateOnDuplicate: ['mahasiswa_id', 'dosen_id', 'nilai_akhir', 'komentar', 'tanggal'] });

    // 11. Data untuk tabel 'feedback'
    await queryInterface.bulkInsert('feedback', [{
      mahasiswa_id: budiMhsId,
      dosen_id: AndiId,
      pesan: 'Perkembangan logbook minggu pertama sangat baik, teruskan!',
      tanggal: new Date()
    }, {
      mahasiswa_id: AminahMhsId,
      dosen_id: AndiId,
      pesan: 'Pastikan mencatat setiap detail kegiatan agar mudah dilacak.',
      tanggal: new Date()
    }], { updateOnDuplicate: ['mahasiswa_id', 'dosen_id', 'pesan', 'tanggal'] });

    // 14. Data untuk tabel 'pengumuman'
    // Asumsi user 'aminah' (AminahUserId) adalah mahasiswa, jadi cari user dengan role 'admin' jika ada,
    // jika tidak, fallback ke AndiUserId.
    const adminUserCheck = users.find(u => u.role === 'admin');
    const adminUserId = adminUserCheck ? adminUserCheck.id : AndiUserId;

    await queryInterface.bulkInsert('pengumuman', [{
      admin_user_id: adminUserId,
      judul: 'Jadwal Batas Akhir Unggah Laporan',
      isi: 'Batas akhir pengunggahan laporan akhir magang adalah 30 September 2025.',
      tanggal: new Date(),
      ditujukan_kepada: 'mahasiswa'
    }, {
      admin_user_id: adminUserId,
      judul: 'Pembekalan Dosen Pembimbing',
      isi: 'Akan ada pembekalan untuk dosen pembimbing pada tanggal 25 Juni 2025.',
      tanggal: new Date(),
      ditujukan_kepada: 'dosen'
    }], { updateOnDuplicate: ['admin_user_id', 'judul', 'isi', 'tanggal', 'ditujukan_kepada'] });

    // 15. Data untuk tabel 'rekapitulasi'
    await queryInterface.bulkInsert('rekapitulasi', [{
      // Rekapitulasi Budi (karena laporannya sudah dinilai)
      mahasiswa_id: budiMhsId,
      nilai_akhir: 88.5, // Sesuai dengan nilai di penilaian
      status_laporan: 'selesai',
      tanggal_rekap: new Date('2025-10-10')
    }], { updateOnDuplicate: ['mahasiswa_id', 'nilai_akhir', 'status_laporan', 'tanggal_rekap'] });

  },

  down: async (queryInterface, Sequelize) => {
    // Hapus semua data yang dimasukkan di atas. Urutan PENTING! Kebalikan dari urutan INSERT.
    await queryInterface.bulkDelete('rekapitulasi', {}, {});
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
