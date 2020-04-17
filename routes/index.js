'use strict';
const express = require('express');
const router = express.Router();
const loader = require('../models/sequelize-loader');
const Op = loader.Sequelize.Op;
const Schedule = require('../models/schedule');
const User = require('../models/user');
const Availability = require('../models/Availability');
const moment = require('moment-timezone');

/* GET home page. */
router.get('/', (req, res, next) => {
  const title = '予定調整くん';
  if (req.user) {
    Availability.findAll({
      attributes: ['scheduleId'],
      where: { userId: req.user.id },
      group: ['scheduleId'],
    })
      .then(availabilities => {
        return Schedule.findAll({
          include: [
            {
              model: User,
              attributes: ['userId', 'username'],
            },
          ],
          where: {
            [Op.or]: {
              createdBy: req.user.id,
              scheduleId: { [Op.in]: availabilities.map(a => a.scheduleId) },
            },
          },
          order: [['updatedAt', 'DESC']],
        });
      })
      .then(schedules => {
        schedules.forEach(schedule => {
          schedule.formattedUpdatedAt = moment(schedule.updatedAt)
            .tz('Asia/Tokyo')
            .format('YYYY/MM/DD HH:mm');
        });
        res.render('index', {
          title: title,
          user: req.user,
          schedules: schedules,
        });
      });
  } else {
    res.render('index', { title: title, user: req.user });
  }
});

module.exports = router;
