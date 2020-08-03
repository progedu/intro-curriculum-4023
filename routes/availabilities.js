'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./authentication-ensurer');
const Availability = require('../models/availability');

router.post('/:scheduleId/users/:userId/candidates/:candidateId', authenticationEnsurer, (req, res, next) => {
  const scheduleId = req.params.scheduleId;
  const userId = req.params.userId;
  const candidateId = req.params.candidateId;
  const filledAt = new Date();
  console.log(filledAt);
  let availability = req.body.availability;
  availability = availability ? parseInt(availability) : 0;

  Availability.upsert({
    scheduleId: scheduleId,
    userId: userId,
    candidateId: candidateId,
    availability: availability,
    filledAt: filledAt
  }).then(() => {
    res.json({ status: 'OK', availability: availability });
  });
});

module.exports = router;
