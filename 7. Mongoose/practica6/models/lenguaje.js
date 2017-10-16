// Archivo: practica6/models/lenguaje.js

'use strict';

const mongoose = require('mongoose');

let esquemaLenguaje = mongoose.Schema({
  nombre:   String,
  fecha:    Number, // Año en el que fue creado el lenguaje
  autor:    String
});

esquemaLenguaje.methods.edad = function () {
  return new Date().getFullYear() - this.fecha;
};

module.exports = mongoose.model('Lenguaje', esquemaLenguaje);