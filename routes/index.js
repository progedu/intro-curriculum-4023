'use strict';
const express = require('express');
const router = express.Router();
const Schedule = require('../models/schedule');
const User = require('../models/user');
const moment = require('moment-timezone');

/* GET home page. */
router.get('/', (req, res, next) => {
  const title = '予定調整くん';
  if (req.user) {
    Schedule.findAll({
      where: {
        createdBy: req.user.id
      },
      order: [['"updatedAt"', 'DESC']]
    }).then((schedules) => {
      schedules.forEach((schedule) => {
        schedule.formattedUpdatedAt = moment(schedule.updatedAt).tz('Asia/Tokyo').format('YYYY/MM/DD HH:mm');
      });
      Schedule.findAll({
        include: [
          {
            model: User,
            attributes: ['userId', 'username']
          }],
        where: {
          createdBy: {$ne: req.user.id}
        },
        order: '"updatedAt" DESC',
        limit: 5
      }).then((otherSchedules) => {
        otherSchedules.forEach((otherSchedule) => {
          otherSchedule.formattedUpdatedAt = moment(otherSchedule.updatedAt).tz('Asia/Tokyo').format('YYYY/MM/DD HH:mm');
        });
      res.render('index', {
        title: title,
        user: req.user,
        schedules: schedules,
        otherSchedules: otherSchedules
      });
      });
    });
  } else {
    res.render('index', { title: title, user: req.user });
  }
});

module.exports = router;
