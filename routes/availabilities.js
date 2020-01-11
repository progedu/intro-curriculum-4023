'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./authentication-ensurer');
const Availability = require('../models/availability');
const Schedule = require('../models/Schedule');
const sequelize = require('../models/sequelize-loader').database;

router.post('/:scheduleId/users/:userId/candidates/:candidateId', authenticationEnsurer, (req, res, next) => {
  const scheduleId = req.params.scheduleId;
  const userId = req.params.userId;
  const candidateId = req.params.candidateId;
  let availability = req.body.availability;
  availability = availability ? parseInt(availability) : 0;
  let topCandidateId = 0;

  Availability.upsert({
    scheduleId: scheduleId,
    userId: userId,
    candidateId: candidateId,
    availability: availability
  }).then(() => {
    // 人気の候補日を再算出する
    return Availability.findOne({
      attributes: [
        'candidateId'
      ],
      where: {
        scheduleId: req.params.scheduleId
      },
      group: ['candidateId'],
      order: [[sequelize.fn('SUM', sequelize.col('availability')), 'DESC']]
    })
  }).then((topCandidate) => {
    topCandidateId = topCandidate.candidateId;

    return Schedule.update(
      { candidateId: topCandidateId },
      { where: { scheduleId: scheduleId } }
    )
  }).then(() => {
    res.json({ status: 'OK', availability: availability, topCandidateId: topCandidateId });
  });
});

module.exports = router;
