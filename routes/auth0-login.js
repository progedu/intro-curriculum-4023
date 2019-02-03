'use strict';
const express = require('express');
const router = express.Router();

var AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID || 'eKWbdnubCoWrjqq8KMuMX6fwmu4eoNG0';
var AUTH0_CALLBACK_URL = process.env.HEROKU_URL + 'auth/auth0' || 'http://localhost:8000/auth/auth0';
router.get('/', (req, res, next) => {
  res.redirect('https://albertgh1996.auth0.com/v2/logout?client_id=' + AUTH0_CLIENT_ID + '&returnTo=' + AUTH0_CALLBACK_URL);
});

module.exports = router;