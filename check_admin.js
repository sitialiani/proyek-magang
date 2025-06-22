const { sequelize } = require('./models');

async function checkAdmin() {
  try {
    console.log('Checking admin users...\n');
    
    const [results] = await sequelize.query('SELECT * FROM user WHERE role = "admin"');
    console.log('Admin users:', results);
    
    console.log('\nChecking all users...');
    const [allUsers] = await sequelize.query('SELECT id, username, email, role FROM user LIMIT 10');
    console.log('All users:', allUsers);
    
    sequelize.close();
  } catch (error) {
    console.error('Error:', error);
    sequelize.close();
  }
}

checkAdmin(); 