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
function authFilter(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  if(req.originalUrl.length==0)
    res.redirect('/login');
  else
    res.redirect('/login?url='+req.originalUrl);
}

//router.all('*', authFilter); /* Autenticacion general por router */

router.get('/new', authFilter, function(req, res) {
    res.render('products/new', { title: 'Nuevo Producto' });
});

router.post('/new', authFilter, function(req, res) {
  // Creamos una instancia del objeto Product con información desde el inicio
  // We create a Product object instance with information since beginning 
  var product =  new Product(req.param('product'));
  product.userId = req.user._id;
  product.creationDate = new Date();
  console.log(product.category);
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

router.get('/', authFilter,function(req, res){
  // Esto se trae todos los registros del modelo Product
  // This function is like a select query that show all the productos of Product model 
  Product.find(function (err, productos) {
    if (err) return console.error(err);
    res.render('products/list', { title: 'Productos', products: productos });
  });
});

router.get('/list_JSON', authFilter, function(req, res){
  // Esto se trae todos los registros del modelo Product
  // This function is like a select query that show all the productos of Product model 
  Product.find(function (err, productos) {
    if (err) return console.error(err);
    return res.json(productos);
  });
});

router.get('/update/:id', authFilter, function(req, res){
  // Busca el producto con id enviado por el usuario y obtiene el contenido
  // Search the product envoy by user and get the respective object 
  Product.findById(req.param('id'), function (err, producto) {
    if (err) return console.error(err);
    res.render('products/update', { title: 'Actualizar producto', product: producto });
  });
});

router.post('/update', authFilter, function(req, res){
  // Busca el producto con id enviado por el usuario y obtiene el contenido
  // Search the product envoy by user and get the respective object 
  var product = new Product(req.param('product'));
  product.updateDate = new Date();

  Product.update({ _id: req.param('id') }, {$set: product }, function (err, producto) {
    if (err) return console.error(err);
    res.redirect('/products');
  });
});

router.get('/delete/:id', authFilter,function(req, res){
  // Con esta funcion elimino todos los productos de cierta categoria
  // This function is a delete instruction that remove all Products with a specified category in the Product model
  Product.remove({ _id: req.param('id') }, function (err) {
    if (err) return handleError(err);
    res.redirect('/products');
  });
});

// Show product details
router.get('/detail/:id', function(req, res){
  // Busca el producto con id enviado por el usuario y obtiene el contenido
  // Search the product envoy by user and get the respective object 
  Product.findById(req.param('id'), function (err, producto) {
    if (err) return console.error(err);
    res.render('products/detail', { title: 'Detalles', product: producto });
  });
});

router.get('/search', function(req, res){
  var search = req.query.name;
  var re = new RegExp(search, 'i');
  // Esto se trae todos los registros del modelo Product
  // This function is like a select query that show all the productos of Product model 
  Product.find({ name: { $regex: re } }, function (err, productos) {
    if (err) return console.error(err);
    res.render('products/results_list', { title: 'Productos encontrados', products: productos });
  });
});

router.post('/photos', function(req, res){
  if(req.files !== undefined){
    var imagePath = "./"+req.files.file.path.replace(/\\/g, "/");
    console.log(imagePath);
    // Image Manipulation packages
    var fs = require('fs');
    var gm = require('gm');
    var thumbPath = "";
    if (fs.existsSync(imagePath)) {
      //This code is for images AdaptativeResize
      gm(imagePath)
        .resize(240, 240, "^")
        .gravity("Center")
        .extent(240, 240)
        .noProfile()
        .write('./public/thumbnails/'+req.files.file.name, function (err) 
        {
          thumbPath = req.protocol + '://' + req.get('host') + "/thumbnails/" + req.files.file.name;
          if(!err) res.json(true, {thumbPath: thumbPath, error: "" });
          else res.json(false, {thumbPath: "", error: err });
      });
    }
  }
});

// Pruebas con dropdown
router.get('/categorias_JSON', function(req, res){
  var categorias = [
    {id:1, categoria:"electronica"},
    {id:2, categoria:"hogar"},
    {id:3, categoria:"computo"},
    {id:4, categoria:"musica"}
  ];
  return res.json(categorias);
});

router.get('/productos_JSON', function(req, res){
  var id_categoria = req.param('id_categoria');
  var productos = [];

  if(id_categoria == 1)
  {
    productos = [{id:1, nombre:"audifonos"},{id:2,nombre:"lavadora"},{id:3,nombre:"refrigerador"}];
  }
  else if(id_categoria == 2){
    productos = [{id:4,nombre:"licuadora"},{id:5,nombre:"picalica"}];
  }
  else if(id_categoria == 3){
    productos = [{id:6,nombre:"monitor"},{id:7,nombre:"SSD"},{id:8, nombre:"regulador"}];
  }
  else if(id_categoria == 4){
    productos = [{id:9,nombre:"guitarra"},{id:10,nombre:"organo"}];
  }

  return res.json(productos);
});

router.get('/cascadas', function(req, res){
  req.io.broadcast('saludo',{ nombre: "noel"});
  res.render('products/cascadas', { title: 'Prueba con angular' });
});

router.get('/ModalTemplate', function(req, res){
  res.render('products/ModalTemplate', { title: 'Template'})
});

router.get('/producto_JSON/:id', function(req, res){
  Product.findById(req.param('id'), function (err, producto) {
    if (err) return console.error(err);
    console.log(producto);
    return res.json([producto]);
  });
});



module.exports = router;