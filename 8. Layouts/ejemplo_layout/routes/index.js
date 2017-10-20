'use strict';

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express',
                        titulo: 'Ja Ja Ja'});
});

module.exports = router;

router.get('/hola', (req, res) => {
  res.render('hola', { titulo: 'Ejemplito' });
});

router.get('/adios', (req, res) => {
  res.render('adios', { titulo: 'Tan Tan'})
});