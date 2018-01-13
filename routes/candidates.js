'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./authentication-ensurer');
const Candidate = require('../models/candidate');
const Availability = require('../models/availability');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

// 同じcandidateIdを持つデータを消す処理
router.post('/:scheduleId/candidates/:candidateId', authenticationEnsurer, csrfProtection, (req, res, next) => {
  const scheduleId = req.params.scheduleId;
  const candidateId = req.params.candidateId;
  if (parseInt(req.query.candidatedelete) === 1) {
    deleteCandidate(candidateId, () => {
      res.redirect('/schedules/' + scheduleId);
    });
  } else {
    const err = new Error('不正なリクエストです');
    err.status = 400;
    next(err);
  }
});

function deleteCandidate(candidateId, done, err) {
  Availability.findAll({
    where: { candidateId: candidateId }
  }).then((availabilities) => {
    const promises = availabilities.map((a) => { return a.destroy(); });
    return Promise.all(promises);
  }).then(() => {
    return Candidate.findById(candidateId).then((c) => { return c.destroy(); });
    //candidate.destroy();
  }).then(() => {
    if (err) return done(err);
    done();
  });
}

module.exports = router;
