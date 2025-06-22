const { Sequelize } = require('sequelize');
const config = require('./config/config.js');

const sequelize = new Sequelize(config.development.database, config.development.username, config.development.password, {
    host: config.development.host,
    dialect: config.development.dialect
});

async function safeDelete(tableName) {
    try {
        await sequelize.query(`DELETE FROM ${tableName}`);
        console.log(`✅ Deleted from ${tableName}`);
    } catch (error) {
        console.log(`⚠️  Table ${tableName} doesn't exist or already empty`);
    }
}

async function fixDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');

        // Hapus data lama yang bermasalah
        console.log('\n🗑️  Cleaning up old data...');
        
        // Hapus data dari tabel yang ada saja
        await safeDelete('pengumuman');
        await safeDelete('feedback');
        await safeDelete('penilaian');
        await safeDelete('laporan');
        await safeDelete('logbook');
        await safeDelete('dokumen');
        await safeDelete('pengajuan_magang');
        await safeDelete('lowongan');
        await safeDelete('perusahaan');
        await safeDelete('mahasiswa');
        await safeDelete('dosen');
        await safeDelete('users');
        
        console.log('✅ Old data cleaned up successfully.');

        // Jalankan seeder yang sudah diperbaiki
        console.log('\n🌱 Running corrected seeder...');
        
        // Import dan jalankan seeder
        const seeder = require('./seeders/20250622014457-sistem-magang.js');
        await seeder.up(sequelize.getQueryInterface(), Sequelize);
        
        console.log('✅ Seeder completed successfully.');

        // Verifikasi data
        console.log('\n🔍 Verifying data...');
        
        const [pengajuanResults] = await sequelize.query(`
            SELECT 
                pm.id, 
                pm.mahasiswa_id, 
                pm.lowongan_id, 
                pm.status,
                m.nama as mahasiswa_nama,
                l.perusahaan as lowongan_perusahaan
            FROM pengajuan_magang pm
            LEFT JOIN mahasiswa m ON pm.mahasiswa_id = m.id
            LEFT JOIN lowongan l ON pm.lowongan_id = l.id
        `);
        
        console.log('\n=== PENGAJUAN MAGANG (with joins) ===');
        console.table(pengajuanResults);

        // Check if there are any valid relationships
        console.log('\n=== VALID RELATIONSHIPS ===');
        pengajuanResults.forEach(p => {
            if (p.mahasiswa_nama && p.lowongan_perusahaan) {
                console.log(`✅ ID ${p.id}: ${p.mahasiswa_nama} -> ${p.lowongan_perusahaan}`);
            } else {
                console.log(`❌ ID ${p.id}: Missing data (mahasiswa: ${p.mahasiswa_nama}, lowongan: ${p.lowongan_perusahaan})`);
            }
        });

        console.log('\n🎉 Database fixed successfully!');
        console.log('📝 You can now access detail pengajuan magang with valid IDs.');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await sequelize.close();
    }
}

fixDatabase(); 