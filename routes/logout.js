'use strict';
const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  req.logout();
  res.redirect('https://albertgh1996.auth0.com/v2/logout?client_id=eKWbdnubCoWrjqq8KMuMX6fwmu4eoNG0&returnTo=http://localhost:8000');
});

module.exports = router;
