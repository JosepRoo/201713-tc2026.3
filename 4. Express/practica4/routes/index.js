'use strict';

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

router.get('/hola/:nombre?', (req, res) => {
  let nombre = req.params.nombre || 'Mundo';
  res.render('hola.ejs', { 'nombre': nombre,
                           'veces': 5 });
});
