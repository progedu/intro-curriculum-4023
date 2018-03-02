'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

//userId系は計算する必要はないので、INTEGER(またはBIGINT）ではなくSTRINGに
const Comment = loader.database.define('comments', {
  scheduleId: {
    type: Sequelize.UUID,
    primaryKey: true,
    allowNull: false
  },
  userId: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false
  },
  comment: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
    freezeTableName: true,
    timestamps: false
  });

module.exports = Comment;
