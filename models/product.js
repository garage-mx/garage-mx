var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/garagemx_development');

// Conexión con MongoDB
// MongoDB conection

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () { });

var Product = mongoose.model('Product', mongoose.Schema({
  name: String,
  description: Date,
  creationDate: Date,
  updateDate: String,
  category: String,
  price: Number
}));

module.exports = Product
