const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true, // Allow null for OAuth users
  },
  current_plan: {
    type: DataTypes.STRING, // stores the current plan name
    allowNull: true,
  },
  trial_end_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'User', // 'Admin' or 'Finance'
  },
  oauth_user_id: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: true, // This should be null for normal users
  },
  oauth_provider: {
    type: Sequelize.STRING,
    allowNull: true, // This should be null for normal users
  },
}, {
  timestamps: true, // Automatically handle createdAt and updatedAt
});

// Before create hook to handle conditional password validation
User.beforeCreate((user) => {
  // Password is required only for non-OAuth users
  if (!user.oauth_provider && !user.password) {
    throw new Error('Password is required for regular sign-up');
  }

  // If OAuth provider exists, we don't need a password
  if (user.oauth_provider && !user.oauth_user_id) {
    throw new Error('OAuth user ID is required for OAuth users');
  }
});

module.exports = User;
