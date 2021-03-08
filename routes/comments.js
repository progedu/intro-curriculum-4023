'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./authentication-ensurer');
const Comment = require('../models/comment');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

router.post('/:scheduleId/users/:userId/comments', authenticationEnsurer, csrfProtection, (req, res, next) => {
  const scheduleId = req.params.scheduleId;
  const userId = req.params.userId;
  const comment = req.body.comment;

  Comment.upsert({
    scheduleId: scheduleId,
    userId: userId,
    comment: comment.slice(0, 255)
  }).then(() => {
    res.json({ status: 'OK', comment: comment, csrfToken: req.csrfToken() });
  });
});

module.exports = router;
