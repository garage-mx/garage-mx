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

module.exports = Product