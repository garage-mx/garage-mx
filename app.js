var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var routes = require('./routes/index');
var users = require('./routes/users');
var products = require('./routes/products');

/*-------Passport--------*/
var flash = require('connect-flash');
// Passport files
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// Mongoose for login with passport
var login_db = require('mongoose');
login_db.connect('mongodb://localhost/test');
// Passport files
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'keyboard cat'}))
app.use(flash());
// Middleware for passport
app.use(passport.initialize());
app.use(passport.session());

// User schema for passport
var Schema = login_db.Schema;
var UserDetail = new Schema({
      username: String,
      password: String
    }, {
      collection: 'userInfo'
    });
var UserDetails = login_db.model('userInfo', UserDetail);

// Default view for login with passport
app.get('/login', function(req, res) {
  res.render('login', { title: 'Login', url: req.query.url });
});

app.post('/login',
    passport.authenticate('local', { failureRedirect: '/login' }),  
    function(req, res) {
      UserDetails.findOne({'username':req.body.username}, 
        function(err, user){
          req.session.username = user.username || null;
          app.locals.username = user.username || null;
      });
      // if the user was trying to enter to an especific URL this function redirect after authtentication
      if(JSON.stringify(req.body.url) == 'undefined' || JSON.stringify(req.body.url) == undefined){
        res.redirect('/');
      }
      else{
        res.redirect(req.body.url);
      }
    }
);
 
app.get('/loginSuccess', function(req, res, next) {
  req.flash('auth', 'true');
  res.send('Successfully authenticated');
});

app.get('/logout', function(req, res){
  req.logout();
  delete app.locals.username;
  req.session.destroy();
  res.redirect('/');
});

passport.serializeUser(function(user, done) {
  done(null, user);
});
 
passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    process.nextTick(function () {
        UserDetails.findOne({'username':username},
        function(err, user) {
          if (err) { return done(err); }
          if (!user) { return done(null, false); }
          if (user.password != password) { return done(null, false); }
          return done(null, user);
        });
    });
  }
));

app.use('/', routes);
app.use('/users', users);
app.use('/products', products);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
