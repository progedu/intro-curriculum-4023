'use strict';
const express = require('express');
const router = express.Router();
const Schedule = require('../models/schedule');
const moment = require('moment-timezone');

/* GET home page. */
router.get('/', (req, res, next) => {
  const title = '予定調整くん';
  if (req.user) {
    Schedule.findAll({
      where: {
        createdBy: req.user.id
      },
      order: [['updatedAt', 'DESC']]
    }).then((schedules) => {
      schedules.forEach((schedule) => {
        schedule.formattedPassedTime = passedTime(schedule.updatedAt);
        schedule.formattedUpdatedAt = moment(schedule.updatedAt).tz('Asia/Tokyo').format('YYYY/MM/DD HH:mm');
      });
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

function passedTime(updatedAt) {
  const milliseconds = new Date() - new Date(updatedAt);
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(milliseconds / 1000 / 60);
  const hours = Math.floor(milliseconds / 1000 / 60 / 60);
  const days = Math.floor(milliseconds / 1000 / 60 / 60 / 24);
  const years = Math.floor(milliseconds / 1000/ 60 / 60 / 24 / 365);
  if (0 < years) return `${years}年前`
  else if (0 < days) return `${days}日前`
  else if (0 < hours) return `${hours}時間前`
  else if (0 < minutes) return `${minutes}分前`
  else if (15 > seconds) return `たった今`
  else return `${seconds}秒前`
}

module.exports = router;
