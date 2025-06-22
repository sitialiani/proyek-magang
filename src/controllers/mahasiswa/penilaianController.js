const { Penilaian, Mahasiswa, Dosen, PengajuanMagang, Lowongan, Perusahaan } = require('../../../models');

exports.getPenilaianPage = async (req, res) => {
    try {
        // Perbaiki penanganan session user
        let userId;
        if (req.session && req.session.user && req.session.user.id) {
            userId = req.session.user.id;
        } else {
            // Fallback untuk development
            userId = 2; // ID mahasiswa default
        }

        const mahasiswa = await Mahasiswa.findOne({ where: { user_id: userId } });
        if (!mahasiswa) {
            return res.status(404).render('error', { message: 'Data mahasiswa tidak ditemukan.' });
        }

        const penilaian = await Penilaian.findOne({
            where: { mahasiswa_id: mahasiswa.id },
            include: [{ model: Dosen, attributes: ['nama'] }]
        });

        // Ambil pengajuan yang diterima
        const pengajuan = await PengajuanMagang.findOne({
            where: { mahasiswa_id: mahasiswa.id, status: 'diterima' }
        });

        let nilaiData = {
            nama: mahasiswa.nama,
            nim: mahasiswa.npm,
            perusahaan: '-',
            nilai_akhir: null,
            komentar: {
                kinerja: null,
                kedisiplinan: null,
                kolaborasi: null
            },
            dosen_penilai: '-',
            tanggal_penilaian: '-'
        };

        // Jika ada pengajuan yang diterima, ambil data lowongan dan perusahaan
        if (pengajuan) {
            const lowongan = await Lowongan.findOne({
                where: { id: pengajuan.lowongan_id },
                include: [{ model: Perusahaan, attributes: ['nama'] }]
            });
            nilaiData.perusahaan = lowongan?.Perusahaan?.nama || '-';
        }

        if (penilaian) {
            nilaiData.nilai_akhir = penilaian.nilai_akhir;
            nilaiData.dosen_penilai = penilaian.Dosen ? penilaian.Dosen.nama : 'Dosen Tidak Ditemukan';
            nilaiData.tanggal_penilaian = new Date(penilaian.tanggal).toLocaleDateString('id-ID');
            
            // Parsing komentar dengan format yang benar
            if (penilaian.komentar) {
                const komentarParts = penilaian.komentar.split(' | ');
                komentarParts.forEach(part => {
                    const trimmedPart = part.trim();
                    if (trimmedPart.toLowerCase().startsWith('kinerja:')) {
                        nilaiData.komentar.kinerja = trimmedPart.replace(/^kinerja:\s*/i, '');
                    } else if (trimmedPart.toLowerCase().startsWith('kedisiplinan:')) {
                        nilaiData.komentar.kedisiplinan = trimmedPart.replace(/^kedisiplinan:\s*/i, '');
                    } else if (trimmedPart.toLowerCase().startsWith('kolaborasi:')) {
                        nilaiData.komentar.kolaborasi = trimmedPart.replace(/^kolaborasi:\s*/i, '');
                    }
                });
            }
        }

        res.render('penilaian', {
            title: 'Hasil Penilaian Magang',
            data: nilaiData,
            mahasiswa: {
                nama: mahasiswa.nama,
                npm: mahasiswa.npm
            }
        });

    } catch (error) {
        console.error("Error fetching penilaian:", error);
        res.status(500).send("Terjadi kesalahan saat mengambil data penilaian.");
    }
}; 