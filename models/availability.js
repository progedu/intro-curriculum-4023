'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

//userId系は計算する必要はないので、INTEGER(またはBIGINT）ではなくSTRINGに
//facebookのIDは桁数が大きすぎてINTEGERには入らない。
const Availability = loader.database.define('availabilities', {
  candidateId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  userId: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false
  },
  availability: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  scheduleId: {
    type: Sequelize.UUID,
    allowNull: false
  }
}, {
    freezeTableName: true,
    timestamps: false,
    indexes: [
      {
        fields: ['scheduleId']
      }
    ]
  });

module.exports = Availability;
