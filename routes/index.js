'use strict';
const express = require('express');
const router = express.Router();
const Schedule = require('../models/schedule');
const moment = require('moment-timezone');
const Availability = require('../models/availability');

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
        Availability.findAll({
          where: {
            scheduleId: schedule.scheduleId
          },
          order: [
            ['"filledAt"', 'DESC']
          ]
        }).then((availabilities) => {
          if (availabilities) {
            console.log('inner'+availabilities[0].filledAt);
            schedule.formattedFilledAt = moment(availabilities[0].filledAt).tz('Asia/Tokyo').format('YYYY/MM/DD HH:mm');
          }
        });
      });
      console.log('outer'+schedules[0].formattedFilledAt);
      return schedules;
    }).then((schedules) => {
      res.render('index', {
        title: title,
        user: req.user,
        schedules: schedules
      });
    });
  } else {
    res.render('index', { title: title, user: req.user });
  }
});

module.exports = router;
