const { Sequelize } = require('sequelize');
const config = require('./config/config.js');

const sequelize = new Sequelize(config.development.database, config.development.username, config.development.password, {
    host: config.development.host,
    dialect: config.development.dialect
});

async function checkData() {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');

        // Check pengajuan_magang table with more details
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

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

checkData(); 