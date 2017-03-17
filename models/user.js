'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const User = loader.database.define('users', {
  userId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false
  },
  icon: {
    type: Sequelize.STRING,
    allowNull: true
  }
}, {
    freezeTableName: true,
    timestamps: false
  });

module.exports = User;