var express = require('express')
  , router  = express.Router()
  , Product = require('../models/product');

router.get('/', function(req, res) {

  Product.find({}, function(err, products) {
    if (err) { return console.error(err) };
    res.render('products/index', {
      title: 'Productos',
      products: products
    });
  });

});

router.get('/new', function(req, res) {
  res.render('products/new', { title: 'Nuevo Producto' });
});

router.post('/', function(req, res) {

  var product = new Product(req.param('product'));

  product.save(function (err) {
    if (err) { res.redirect('/products/new'); };
    res.redirect('/products');
  });
});

router.get('/:id/edit', function(req, res) {

  Product.findById(req.param('id'), function(err, product) {
    if (err) { res.redirect('/products'); };
    res.render('products/edit', {
      title: 'Editar Producto',
      product: product
    });
  });

});

router.post('/:id/update', function(req, res) {

  Product.update({ _id: req.param('id') }, req.param('product'), function(err, affected) {
    if (err) { res.redirect('/products/' + req.param('id') + '/edit'); };
    res.redirect('/products');
  });

});

router.get('/:id/destroy', function(req, res) {
  Product.remove({ _id: req.param('id') }, function(err, result) {
    if (err) { res.redirect('/products'); };
    res.redirect('/products');
  });
});

module.exports = router;
