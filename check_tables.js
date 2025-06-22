const { sequelize } = require('./models');

async function checkTables() {
  try {
    console.log('Checking database tables...\n');
    
    const [results] = await sequelize.query('SHOW TABLES');
    console.log('Tables in database:');
    results.forEach(row => {
      console.log(`- ${Object.values(row)[0]}`);
    });
    
    console.log('\nChecking pengumuman table:');
    const [pengumuman] = await sequelize.query('SELECT * FROM pengumuman LIMIT 5');
    console.log('Pengumuman records:', pengumuman.length);
    
    console.log('\nChecking penilaian table:');
    const [penilaian] = await sequelize.query('SELECT * FROM penilaian LIMIT 5');
    console.log('Penilaian records:', penilaian.length);
    
    console.log('\nChecking rekapitulasi table:');
    const [rekapitulasi] = await sequelize.query('SELECT * FROM rekapitulasi LIMIT 5');
    console.log('Rekapitulasi records:', rekapitulasi.length);
    
    await sequelize.close();
    console.log('\n✅ Database check completed successfully!');
    
  } catch (error) {
    console.error('❌ Error checking database:', error.message);
    await sequelize.close();
  }
}

checkTables(); 