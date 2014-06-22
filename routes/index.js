var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express', olakase: "Ola k ase o te pego?"});
});

router.get('/olakase', function(req, res) {
  res.render('olakase', { title: 'Express', olakase: "Ola k ase o te pego?"});
});

module.exports = router;
