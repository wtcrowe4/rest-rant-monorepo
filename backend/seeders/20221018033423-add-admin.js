'use strict';
const bcrypt = require('bcrypt');
const adminPassword = process.env.ADMIN_PASSWORD;
const adminEmail = process.env.ADMIN_EMAIL;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users', [{
      first_name: 'Admin',
      last_name: null,
      email: adminEmail,
      password_digest: bcrypt.hashSync(adminPassword, 10),
      role: 'admin',
      created_at: new Date(),
      updated_at: new Date()
    }], {});
    
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', {
      email: adminEmail
    });
  }
};
