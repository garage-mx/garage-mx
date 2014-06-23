var express         = require('express')
  , router          = express.Router()
  , UsersProcessor  = require('../processors/users_processor');

/* GET home page. */
router.get('/sign_in', function(req, res) {
  if (!req.user) {
    res.render('users/sign_in', {});
  }
  else {
    res.redirect('/');
  }
});

router.get('/sign_up', function(req, res) {
  if (!req.user) { res.render('users/sign_up', {}); }
  else { res.redirect('/'); }
});

router.post('/sessions', function(req, res) {
  processor = new UsersProcessor();
  if (processor.create_user(req.body.user)) {
    res.redirect('/');
  } else {
    res.redirect('/users/sign_up');
  }
});

module.exports = router;
