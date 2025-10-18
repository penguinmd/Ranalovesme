// One-time script to create Rana and Mark's accounts
require('dotenv').config();
const db = require('./src/models/database');
const User = require('./src/models/User');
const { hashPassword } = require('./src/utils/password');

async function setupUsers() {
  try {
    // Initialize database
    await db.initialize();

    const password = 'Gentoo12mdr!';
    const hashedPassword = await hashPassword(password);

    // Create Rana's account
    try {
      const ranaId = await User.create({
        username: 'rana',
        password: hashedPassword,
        display_name: 'Rana'
      });
      console.log('✅ Created Rana\'s account (ID:', ranaId, ')');
    } catch (err) {
      if (err.message.includes('UNIQUE')) {
        console.log('⚠️  Rana\'s account already exists');
      } else {
        throw err;
      }
    }

    // Create Mark's account
    try {
      const markId = await User.create({
        username: 'mark',
        password: hashedPassword,
        display_name: 'Mark'
      });
      console.log('✅ Created Mark\'s account (ID:', markId, ')');
    } catch (err) {
      if (err.message.includes('UNIQUE')) {
        console.log('⚠️  Mark\'s account already exists');
      } else {
        throw err;
      }
    }

    console.log('\n✅ Setup complete! Both accounts ready.');
    console.log('Username: rana or mark');
    console.log('Password: Gentoo12mdr!');

    await db.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

setupUsers();
