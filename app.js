var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require('helmet');
var session = require('express-session');
var passport = require('passport');
// モデルの読み込み
var User = require('./models/user');
var Schedule = require('./models/schedule');
var Availability = require('./models/availability');
var Candidate = require('./models/candidate');
var Comment = require('./models/comment');
User.sync().then(() => {
  Schedule.belongsTo(User, { foreignKey: 'createdBy' });
  Schedule.sync();
  Comment.belongsTo(User, { foreignKey: 'userId' });
  Comment.sync();
  Availability.belongsTo(User, { foreignKey: 'userId' });
  Candidate.sync().then(() => {
    Availability.belongsTo(Candidate, { foreignKey: 'candidateId' });
    Availability.sync();
  });
});


var GitHubStrategy = require('passport-github2').Strategy;
var GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || '2f831cb3d4aac02393aa';
var GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || '9fbc340ac0175123695d2dedfbdf5a78df3b8067';

// TODO サービス公開の際はIDとSECRETをサーバーの環境変数から読み込む設定をかくこと
var Auth0Strategy = require('passport-auth0').Strategy;
var AUTH0_CLIENT_ID = 'eKWbdnubCoWrjqq8KMuMX6fwmu4eoNG0';
var AUTH0_CLIENT_SECRET = 'jS6e60viZXgTjUXStbUk0QYb6RxbgYtCjPVlnUDOuPS8ringgsPCIaE1oeykna4h';

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});


passport.use(new GitHubStrategy({
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: process.env.HEROKU_URL ? process.env.HEROKU_URL + 'auth/github/callback' : 'http://localhost:8000/auth/github/callback'
},
  function (accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      User.upsert({
        userId: profile.id,
        username: profile.username
      }).then(() => {
        done(null, profile);
      });
    });
  }
));

passport.use(new Auth0Strategy({
  domain: 'albertgh1996.auth0.com',
  clientID: AUTH0_CLIENT_ID,
  clientSecret: AUTH0_CLIENT_SECRET,
  callbackURL: 'http://localhost:8000/auth/auth0/callback',
  state: false
},
  function (accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      console.log(profile);
      console.log(profile.id)
      const profileSubHex = profile.id.split("|")[1];
      const profileSubDec = parseInt(profileSubHex);
      User.upsert({
        userId: profileSubDec,
        username: profile.nickname
      }).then(() => {
        done(null, ({ id: profileSubDec, username: profile.nickname }));
      });
    });
  }
));

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');
var schedulesRouter = require('./routes/schedules');
var availabilitiesRouter = require('./routes/availabilities');
var commentsRouter = require('./routes/comments');

var app = express();
app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: 'e55be81b307c1c09', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/schedules', schedulesRouter);
app.use('/schedules', availabilitiesRouter);
app.use('/schedules', commentsRouter);

app.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] }),
  function (req, res) {
  });

app.get('/auth/auth0',
  passport.authenticate('auth0', {connection: 'Username-Password-Authentication'}),
  function (req, res) {
  });

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function (req, res) {
    var loginFrom = req.cookies.loginFrom;
    // オープンリダイレクタ脆弱性対策
    if (loginFrom &&
      loginFrom.indexOf('http://') < 0 &&
      loginFrom.indexOf('https://') < 0) {
      res.clearCookie('loginFrom');
      res.redirect(loginFrom);
    } else {
      res.redirect('/');
    }
  });

app.get('/auth/auth0/callback',
  passport.authenticate('auth0', { failureRedirect: '/login'}),
  function (req, res) {
    var loginFrom = req.cookies.loginFrom;
    // オープンリダイレクタ脆弱性対策
    if (loginFrom &&
      loginFrom.indexOf('http://') < 0 &&
      loginFrom.indexOf('https://') < 0) {
      res.clearCookie('loginFrom');
      res.redirect(loginFrom);
    } else {
      res.redirect('/');
    }
  });

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
