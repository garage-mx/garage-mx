var mongoose = require('mongoose');
mongoose.createConnection('mongodb://localhost/test');

// Conexión con MongoDB
// MongoDB conection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  // yay!
});

// Esquema inicial del Modelo Product
// Initial schema of Model Product
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
var productSchema = mongoose.Schema({
    name: String,
    description: String,
    creationDate: Date,
    updateDate: String, 
    category: String,
    price: Number,
    userId: ObjectId,
    state: String,
    imageUrl: String,
    imageGalery: Object,
    sales: Number,
    visible: Boolean,
    shippingMethod: Number,
    shippingDescription: String
});

var Product = mongoose.model('Product', productSchema);

module.exports = Product