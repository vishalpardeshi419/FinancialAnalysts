const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Plan = sequelize.define('Plan', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    features: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
});
  
module.exports = Plan;