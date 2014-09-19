var express = require('express');
var router = express.Router();

router.get('/caracteres_restantes', function(req, res){
  res.render('examples/caracteres_restantes', { title: 'Prueba con angular' });
});

module.exports = router;