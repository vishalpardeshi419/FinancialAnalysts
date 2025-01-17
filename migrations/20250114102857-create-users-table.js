'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false, 
      },
      oauth_user_id: {
        type: Sequelize.STRING,
        unique: true,      // Ensure unique OAuth IDs
        allowNull: true, 
      },
      oauth_provider : {
        type: Sequelize.STRING,
        allowNull: true,
      },
      username : {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email : {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      current_plan: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      trial_end_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'User',  // 'Admin' or 'Finance'
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};
