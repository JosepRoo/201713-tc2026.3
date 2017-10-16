'use strict';

const Lenguaje = require(__dirname + '/../models/lenguaje.js');

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

router.get('/insertar', (req, res) => {
  let bf = new Lenguaje({ nombre: 'Brainfuck', 
                          fecha: 1993,  
                          autor: 'Urban Müller'});
  bf.save((err, obj) => {
    if (!err) console.log(obj.nombre + ' ha sido guardado');
  });
  res.render('insertar', {'nombre': 'Brainfuck'});
});
