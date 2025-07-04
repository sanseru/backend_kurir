const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create a new instance of Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USERNAME,  // Ubah dari DB_USER ke DB_USERNAME
  process.env.DB_PASSWORD, 
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
  }
);

// Test the database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// Export the sequelize instance and the test connection function
module.exports = {
  sequelize,
  testConnection,
};