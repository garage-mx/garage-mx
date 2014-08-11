var express = require('express');
var router = express.Router();
var Product = require('../models/products');

/* GET home page. */
router.get('/', function(req, res) {
  Product.find()
  .limit(5)
  .sort( { creationDate: -1} )
  .exec(function (err, productos) {
      if (err) return console.error(err);
      res.render('index', { title: 'GarageMX', products: productos });
    }
  );
});

module.exports = router;
