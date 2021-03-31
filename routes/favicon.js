'use strict';
const express = require('express');
const router = express.Router();
const fs = require('fs');

router.get('/favicon.ico', (req, res, next) => {
  res.writeHead(200, {
    'Content-Type': 'image/vnd.microsoft.icon'
  });
  const favicon = fs.readFileSync(__dirname + '/public/favicon.ico');
  res.end(favicon);
});

module.exports = router;
