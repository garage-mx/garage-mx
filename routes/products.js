var express = require('express');
var router = express.Router();
var Product = require('../models/products');
/*
// Actualiza el producto con nombre 'Disco duro' y lo cambia a 'SSD'
// Update the product named 'Disco duro' and change it to 'SSD'
Product.update({ name: 'Disco duro' }, { name: 'SSD' }, function (err, numberAffected, raw) {
  if (err) return handleError(err);
  console.log('The number of updated documents was %d', numberAffected);
  console.log('The raw response from Mongo was ', raw);
});

*/
// Simple route middleware to ensure user is authenticated.
// Use this route middleware on any resource that needs to be protected. If
// the request is authenticated (typically via a persistent login session),
// the request will proceed. Otherwise, the user will be redirected to the
// login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

router.all('/new',ensureAuthenticated).get('/new', function(req, res) {
    res.render('products/new', { title: 'Nuevo Producto' });
});

router.post('/new', function(req, res) {
  // Creamos una instancia del objeto Product con información desde el inicio
  // We create a Product object instance with information since beginning 
  var product =  new Product(req.param('product'));

  // Con esta funcion guardamos el producto en el modelo Product
  // This function save the prouducto object in Product model
  product.save(function (err, product) {
    if (err) {
      return console.error(err);
    }
    else{
      console.error("Guardado con exito");
      res.redirect('/products');
    }
  });
  
});

router.get('/',function(req, res){
  // Esto se trae todos los registros del modelo Product
  // This function is like a select query that show all the productos of Product model 
  Product.find(function (err, productos) {
    if (err) return console.error(err);
    res.render('products/list', { title: 'Productos', products: productos });
  });
});

router.get('/update/:id', function(req, res){
  // Busca el producto con id enviado por el usuario y obtiene el contenido
  // Search the product envoy by user and get the respective object 
  Product.findById(req.param('id'), function (err, producto) {
    if (err) return console.error(err);
    res.render('products/update', { title: 'Actualizar producto', product: producto });
  });
});

router.post('/update', function(req, res){
  // Busca el producto con id enviado por el usuario y obtiene el contenido
  // Search the product envoy by user and get the respective object 
  Product.update({ _id: req.param('id') }, {$set: req.param('product')}, function (err, producto) {
    if (err) return console.error(err);
    res.redirect('/products');
  });
});

router.get('/delete/:id',function(req, res){
  // Con esta funcion elimino todos los productos de cierta categoria
  // This function is a delete instruction that remove all Products with a specified category in the Product model
  Product.remove({ _id: req.param('id') }, function (err) {
    if (err) return handleError(err);
    res.redirect('/products');
  });
});

module.exports = router;