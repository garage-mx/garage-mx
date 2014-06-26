var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

// Conexión con MongoDB
// MongoDB conection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  // yay!
});

// Esquema inicial del Modelo Product
// Initial schema of Model Product
var productSchema = mongoose.Schema({
    name: String,
    description: Date,
    creationDate: Date,
    updateDate: String, 
    category: String,
    price: Number
});


var Product = mongoose.model('Product', productSchema);

/*
// Creamos una instancia del objeto Product con información desde el inicio
// We create a Product object instance with information from the beginning 
var producto = new Product({ name: 'Disco duro', category: 'Computo', price: 1000 })
console.log(producto.name +" $"+ producto.price);

// Con esta funcion guardamos el producto en el modelo Product
// This function save the prouducto object in Product model
producto.save(function (err, producto) {
  if (err) return console.error(err);
  console.error("Guardado con exito");
});
/*

/*
// Con esta funcion elimino todos los productos de cierta categoria
// This function is a delete instruction that remove all Products with a specified category in the Product model
Product.remove({ category: 'Fotografia' }, function (err) {
  if (err) return handleError(err);
  // removed!
});

// Actualiza el producto con nombre 'Disco duro' y lo cambia a 'SSD'
// Update the product named 'Disco duro' and change it to 'SSD'
Product.update({ name: 'Disco duro' }, { name: 'SSD' }, function (err, numberAffected, raw) {
  if (err) return handleError(err);
  console.log('The number of updated documents was %d', numberAffected);
  console.log('The raw response from Mongo was ', raw);
});
*/
// Esto se trae todos los registros del modelo Product
// This function is like a select query that show all the productos of Product model 
exports.funciones = function()
{
  var valor = null;
  return {
    productsList: function(result) 
    {
      Product.find(function (err, productos) {
        if (err) return console.error(err);
        valor = JSON.stringify(productos);
        console.log(productos);
        result(valor);
      });
    }
  }
}

/*
// Busca el producto con nombre 'SSD' y obtiene el contenido
// Search the product named 'SSD' and get the respective object 
Product.findOne({ name: 'SSD' }, function (err, doc) {
  if (err) return console.error(err);
  console.log(doc);
});*/

/* GET home page. */
router.get('/', function(req, res) {
  res.render('products/index', { title: 'Productos' });
});

router.route('/new')
  .get(function(req, res, next) {
    res.render('products/new', { title: 'Nuevo Productos' });
  })
  .post(function(req, res, next) {
    var product = req.param('product');
    console.log(product.price);
    res.redirect('/products/list');
  });

router.get('/list',function(req, res){
  console.log(exports.funciones.productsList(function(data){ console.log(data); }));
  res.render('products/list', { title: 'Lista de productos', products: exports.productsList() });
});
module.exports = router;