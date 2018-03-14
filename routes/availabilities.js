'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./authentication-ensurer');
const Availability = require('../models/availability');

router.post('/:scheduleId/users/:userId/candidates/:candidateId', authenticationEnsurer, (req, res, next) => {
  const scheduleId = req.params.scheduleId;
  const userId = req.params.userId;
  const candidateId = req.params.candidateId;
  let availability = req.body.availability;
  let userCount = null;
  availability = availability ? parseInt(availability) : 0;

  Availability.upsert({
    scheduleId: scheduleId,
    userId: userId,
    candidateId: candidateId,
    availability: availability
  }).then(() => {
    // ユーザー数を取得
    return Availability.findAll({
      attributes: ['userId'],
      where: { scheduleId: scheduleId, candidateId: candidateId }
    });
  }).then((availabilities) => {
    userCount = availabilities.length;
    // 出席人数を取得
    return Availability.findAll({
      attributes: ['userId'],
      where: { scheduleId: scheduleId, candidateId: candidateId, availability: 2 }
    });
  }).then((attendances) => {
    const attendanceCount = attendances.length;
    // 出席率を計算
    const attendanceRate = attendanceCount ? Math.round(attendanceCount / userCount * 100) : 0;
    res.json({ status: 'OK', availability: availability, attendanceRate: attendanceRate });
  });
});

module.exports = router;
