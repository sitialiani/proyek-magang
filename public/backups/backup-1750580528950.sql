/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: backup
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `backup` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_size` bigint(20) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: dokumen
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `dokumen` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pengajuan_id` int(11) DEFAULT NULL,
  `nama_file` varchar(255) DEFAULT NULL,
  `jenis` varchar(255) DEFAULT NULL,
  `file_path` text DEFAULT NULL,
  `tanggal_upload` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: dosen
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `dosen` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `nama` varchar(255) DEFAULT NULL,
  `nidn` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `telepon` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: feedback
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `feedback` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dosen_id` int(11) DEFAULT NULL,
  `laporan_id` int(11) DEFAULT NULL,
  `pesan` text DEFAULT NULL,
  `tanggal` datetime DEFAULT NULL,
  `mahasiswa_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `feedback_mahasiswa_id_foreign_idx` (`mahasiswa_id`),
  CONSTRAINT `feedback_mahasiswa_id_foreign_idx` FOREIGN KEY (`mahasiswa_id`) REFERENCES `mahasiswa` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: laporan
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `laporan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mahasiswa_id` int(11) DEFAULT NULL,
  `judul` varchar(255) DEFAULT NULL,
  `file_path` text DEFAULT NULL,
  `status` enum(
  'belum dikumpulkan',
  'menunggu',
  'revisi',
  'diterima'
  ) DEFAULT NULL,
  `tanggal_upload` datetime DEFAULT NULL,
  `versi` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: lowongan
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `lowongan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `perusahaan_id` int(11) DEFAULT NULL,
  `perusahaan` varchar(255) DEFAULT NULL,
  `lokasi` varchar(255) DEFAULT NULL,
  `durasi` varchar(255) DEFAULT NULL,
  `deadlinependaftaran` date DEFAULT NULL,
  `deskripsi` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: mahasiswa
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `mahasiswa` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `dosen_pembimbing_id` int(11) DEFAULT NULL,
  `nama` varchar(255) DEFAULT NULL,
  `nim` varchar(255) DEFAULT NULL,
  `jurusan` varchar(255) DEFAULT NULL,
  `angkatan` int(11) DEFAULT NULL,
  `no_hp` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: pengajuan_magang
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `pengajuan_magang` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mahasiswa_id` int(11) DEFAULT NULL,
  `lowongan_id` int(11) DEFAULT NULL,
  `tanggal_pengajuan` date DEFAULT NULL,
  `status` enum('diajukan', 'diterima', 'ditolak', 'selesai') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: perusahaan
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `perusahaan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama` varchar(255) DEFAULT NULL,
  `alamat` text DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `telepon` varchar(255) DEFAULT NULL,
  `pic` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: sequelizemeta
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `sequelizemeta` (
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8 COLLATE = utf8_unicode_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: user
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `role` enum('mahasiswa', 'dosen', 'admin') DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `status` enum('Aktif', 'Non-Aktif') NOT NULL DEFAULT 'Aktif',
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 7 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: backup
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: dokumen
# ------------------------------------------------------------

INSERT INTO
  `dokumen` (
    `id`,
    `pengajuan_id`,
    `nama_file`,
    `jenis`,
    `file_path`,
    `tanggal_upload`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    1,
    1,
    'CV_Budi.pdf',
    'CV',
    '/dokumen/cv_budi.pdf',
    '2025-06-22 07:11:08',
    '0000-00-00 00:00:00',
    '0000-00-00 00:00:00'
  );
INSERT INTO
  `dokumen` (
    `id`,
    `pengajuan_id`,
    `nama_file`,
    `jenis`,
    `file_path`,
    `tanggal_upload`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    2,
    1,
    'Surat_Penerimaan_Budi.pdf',
    'surat',
    '/dokumen/surat_budi.pdf',
    '2025-06-22 07:11:08',
    '0000-00-00 00:00:00',
    '0000-00-00 00:00:00'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: dosen
# ------------------------------------------------------------

INSERT INTO
  `dosen` (`id`, `user_id`, `nama`, `nidn`, `email`, `telepon`)
VALUES
  (
    1,
    2,
    'Prof. Dr. Andi Permana',
    '198001012005011001',
    'andi.permana@gmail.com',
    '08123456789'
  );
INSERT INTO
  `dosen` (`id`, `user_id`, `nama`, `nidn`, `email`, `telepon`)
VALUES
  (
    2,
    2,
    'Susanti S.Kom, M.Kom',
    '199001012505011001',
    'susanti@gmail.com',
    '08113458964'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: feedback
# ------------------------------------------------------------

INSERT INTO
  `feedback` (
    `id`,
    `dosen_id`,
    `laporan_id`,
    `pesan`,
    `tanggal`,
    `mahasiswa_id`
  )
VALUES
  (
    1,
    1,
    1,
    'Overall, laporan ini sangat baik. Namun, ada beberapa saran untuk perbaikan.',
    '2025-06-22 07:11:08',
    NULL
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: laporan
# ------------------------------------------------------------

INSERT INTO
  `laporan` (
    `id`,
    `mahasiswa_id`,
    `judul`,
    `file_path`,
    `status`,
    `tanggal_upload`,
    `versi`
  )
VALUES
  (
    1,
    1,
    'Pengembangan Antarmuka Pengguna E-Commerce',
    '/files/laporan/budi_final_report.pdf',
    'menunggu',
    '2025-06-22 07:11:08',
    'v1.0'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: lowongan
# ------------------------------------------------------------

INSERT INTO
  `lowongan` (
    `id`,
    `perusahaan_id`,
    `perusahaan`,
    `lokasi`,
    `durasi`,
    `deadlinependaftaran`,
    `deskripsi`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    1,
    1,
    'PT.Semen Padang',
    'Padang',
    '3 bulan',
    '2025-06-30',
    'Bagian Frontend',
    '0000-00-00 00:00:00',
    '0000-00-00 00:00:00'
  );
INSERT INTO
  `lowongan` (
    `id`,
    `perusahaan_id`,
    `perusahaan`,
    `lokasi`,
    `durasi`,
    `deadlinependaftaran`,
    `deskripsi`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    2,
    2,
    'CV.Karya Bersama',
    'Jakarta',
    '6 bulan',
    '2025-07-31',
    'Bagian Backend',
    '0000-00-00 00:00:00',
    '0000-00-00 00:00:00'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: mahasiswa
# ------------------------------------------------------------

INSERT INTO
  `mahasiswa` (
    `id`,
    `user_id`,
    `dosen_pembimbing_id`,
    `nama`,
    `nim`,
    `jurusan`,
    `angkatan`,
    `no_hp`
  )
VALUES
  (
    1,
    3,
    1,
    'Budi Santoso',
    '2022001',
    'Sistem Informasi',
    2022,
    '081211122233'
  );
INSERT INTO
  `mahasiswa` (
    `id`,
    `user_id`,
    `dosen_pembimbing_id`,
    `nama`,
    `nim`,
    `jurusan`,
    `angkatan`,
    `no_hp`
  )
VALUES
  (
    2,
    4,
    1,
    'Siti Aliani',
    '2022002',
    'Sistem Informasi',
    2023,
    '081233344455'
  );
INSERT INTO
  `mahasiswa` (
    `id`,
    `user_id`,
    `dosen_pembimbing_id`,
    `nama`,
    `nim`,
    `jurusan`,
    `angkatan`,
    `no_hp`
  )
VALUES
  (
    3,
    5,
    2,
    'Dinda',
    '2022003',
    'Sistem Informasi',
    2021,
    '081576902381'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: pengajuan_magang
# ------------------------------------------------------------

INSERT INTO
  `pengajuan_magang` (
    `id`,
    `mahasiswa_id`,
    `lowongan_id`,
    `tanggal_pengajuan`,
    `status`
  )
VALUES
  (1, 1, 1, '2025-06-10', 'diterima');
INSERT INTO
  `pengajuan_magang` (
    `id`,
    `mahasiswa_id`,
    `lowongan_id`,
    `tanggal_pengajuan`,
    `status`
  )
VALUES
  (2, 2, 2, '2025-06-12', 'diajukan');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: perusahaan
# ------------------------------------------------------------

INSERT INTO
  `perusahaan` (`id`, `nama`, `alamat`, `email`, `telepon`, `pic`)
VALUES
  (
    1,
    'PT. Teknologi Maju',
    'Jl. Sudirman No. 10 Jakarta',
    'info@teknologimaju.com',
    '021-12345678',
    'Bpk. Rizky Pratama'
  );
INSERT INTO
  `perusahaan` (`id`, `nama`, `alamat`, `email`, `telepon`, `pic`)
VALUES
  (
    2,
    'CV. Solusi Digital',
    'Jl. Thamrin No. 5 Bandung',
    'contact@solusidigital.com',
    '022-98765432',
    'Ibu. Dewi Lestari'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: sequelizemeta
# ------------------------------------------------------------

INSERT INTO
  `sequelizemeta` (`name`)
VALUES
  ('20250622013041-create-user.js');
INSERT INTO
  `sequelizemeta` (`name`)
VALUES
  ('20250622013057-create-dosen.js');
INSERT INTO
  `sequelizemeta` (`name`)
VALUES
  ('20250622013118-create-mahasiswa.js');
INSERT INTO
  `sequelizemeta` (`name`)
VALUES
  ('20250622013757-create-laporan.js');
INSERT INTO
  `sequelizemeta` (`name`)
VALUES
  ('20250622014216-create-feedback.js');
INSERT INTO
  `sequelizemeta` (`name`)
VALUES
  (
    '20250622024125-add-mahasiswa_id-to-feedback-table.js'
  );
INSERT INTO
  `sequelizemeta` (`name`)
VALUES
  ('20250622035106-create-perusahaan.js');
INSERT INTO
  `sequelizemeta` (`name`)
VALUES
  ('20250622035124-create-pengajuan-magang.js');
INSERT INTO
  `sequelizemeta` (`name`)
VALUES
  ('20250622041358-create-dokumen.js');
INSERT INTO
  `sequelizemeta` (`name`)
VALUES
  ('20250622052104-create-lowongan.js');
INSERT INTO
  `sequelizemeta` (`name`)
VALUES
  ('20250622074256-add-status-to-user.js');
INSERT INTO
  `sequelizemeta` (`name`)
VALUES
  ('20250622081228-create-backups-table.js');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: user
# ------------------------------------------------------------

INSERT INTO
  `user` (
    `id`,
    `username`,
    `password`,
    `email`,
    `role`,
    `created_at`,
    `updated_at`,
    `status`
  )
VALUES
  (
    1,
    'admin',
    '$2b$10$EBE9J1LTJ6qZd2438h1cXO.GOl8N2xwqR8t5ShdhS4Zgk21Ch4SJy',
    'admin@example.com',
    'admin',
    '2025-06-22 07:11:08',
    '2025-06-22 07:11:08',
    'Aktif'
  );
INSERT INTO
  `user` (
    `id`,
    `username`,
    `password`,
    `email`,
    `role`,
    `created_at`,
    `updated_at`,
    `status`
  )
VALUES
  (
    2,
    'andi',
    '$2b$10$jr7f2z5JdsBMQB/1mbW3yONPWlhz4OpSPhZO5ZabJSjp7FyQpex.S',
    'andi@gmail.com',
    'dosen',
    '2025-06-22 07:11:08',
    '2025-06-22 07:11:08',
    'Aktif'
  );
INSERT INTO
  `user` (
    `id`,
    `username`,
    `password`,
    `email`,
    `role`,
    `created_at`,
    `updated_at`,
    `status`
  )
VALUES
  (
    3,
    'budi',
    '$2b$10$CUyh7I0lvFkiy76zlkTYDeAYQT5SKokCUI006LQJanuEb2o1kOm16',
    'budi@gmail.com',
    'mahasiswa',
    '2025-06-22 07:11:08',
    '2025-06-22 07:11:08',
    'Aktif'
  );
INSERT INTO
  `user` (
    `id`,
    `username`,
    `password`,
    `email`,
    `role`,
    `created_at`,
    `updated_at`,
    `status`
  )
VALUES
  (
    4,
    'siti',
    '$2b$10$BB36R7wtyNq.T3ROjPoNluP9wy5EbIV3pxSuyiB/lVbjbpcZ55LnC',
    'siti@gmail.com',
    'mahasiswa',
    '2025-06-22 07:11:08',
    '2025-06-22 07:11:08',
    'Aktif'
  );
INSERT INTO
  `user` (
    `id`,
    `username`,
    `password`,
    `email`,
    `role`,
    `created_at`,
    `updated_at`,
    `status`
  )
VALUES
  (
    5,
    'abe',
    '$2b$10$wzzo9P.S3P1Z51mZM/reb.sgbmqIVEILYob3TdyKKA9Yccqncs5PW',
    'abe@gmail.com',
    'mahasiswa',
    '2025-06-22 07:54:01',
    '2025-06-22 07:54:01',
    'Aktif'
  );
INSERT INTO
  `user` (
    `id`,
    `username`,
    `password`,
    `email`,
    `role`,
    `created_at`,
    `updated_at`,
    `status`
  )
VALUES
  (
    6,
    'lila',
    '$2b$10$22Ps2mWdG2BQxE96ISGKiOrre23/Li4nyjPh3hYG3JyGz7YZ8guiy',
    'lila@gmail.com',
    'dosen',
    '2025-06-22 08:01:38',
    '2025-06-22 08:05:34',
    'Non-Aktif'
  );

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
