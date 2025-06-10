const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_FILE
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connection successful.');
  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
})();