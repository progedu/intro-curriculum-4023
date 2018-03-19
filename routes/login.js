'use strict';
// 'debug'モジュール呼び出し
const debug = require('debug');
// デバッガーを作成する
const loginJs_debugger = debug('debug:login.js');
loginJs_debugger('login.js処理開始');

const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  loginJs_debugger('GET処理開始')
  // リダイレクト元のURL
  const from = req.query.from;
  // が存在すれば
  if (from) {
    // cookieに'loginFrom'プロパティとして
    // リダイレクト元URLを渡す
    res.cookie('loginFrom', from,
      // 有効期限10分
      { expires: new Date(Date.now() + 600000) });
  }
  res.render('login');
  loginJs_debugger('GET処理完了')
});

module.exports = router;
