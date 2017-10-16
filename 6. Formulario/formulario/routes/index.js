'use strict';

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

router.get('/formulario', (req, res) => {
  res.render('formulario', {});
});

router.post('/recepcion', (req, res) => {
  // req.query es para el método get
  // req.body es para el método post
  req.session.nombre = req.body.nombre;
  req.session.apellido = req.body.apellido;
  res.redirect('/final');
});

router.get('/final', (req, res) => {
  let nombre = req.session['nombre'] || 'Juan';
  let apellido = req.session['apellido'] || 'Cameney';
  res.render('gracias', {nombre, apellido});
});
