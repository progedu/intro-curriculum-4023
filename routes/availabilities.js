'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./authentication-ensurer');
const Availability = require('../models/availability');
const Candidate = require('../models/candidate');

router.post('/:scheduleId/users/:userId/candidates/:candidateId', authenticationEnsurer, (req, res, next) => {
  const scheduleId = req.params.scheduleId;
  const userId = req.params.userId;
  const candidateId = req.params.candidateId;
  let availability = req.body.availability;
  availability = availability ? parseInt(availability) : 0;

  Availability.upsert({
    scheduleId: scheduleId,
    userId: userId,
    candidateId: candidateId,
    availability: availability
  }).then(() => {
    res.json({ status: 'OK', availability: availability });
  });
});

router.post('/:scheduleId/candidates/:candidateId/delete', authenticationEnsurer, (req, res, next) => {
  const candidateId = req.params.candidateId;
  Availability.findAll({
    where: { candidateId: candidateId }
  }).then((availabilities) => {
    const promises = availabilities.map((a) => { return a.destroy(); });
    return Promise.all(promises);
  }).then(() => {
    return Candidate.findById(candidateId).then((c) => { return c.destroy(); });
  }).then(() => {
    res.json({ status: 'OK', deleted: candidateId });
  });
});

module.exports = router;
