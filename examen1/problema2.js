//---------------------------------------------------------
// Solución al problema 2.
//---------------------------------------------------------

'use strict';

const fs = require('fs');
const xml2js = require('xml2js');

let parser = new xml2js.Parser();

let nombreArchivo = process.argv[2];

fs.readFile(nombreArchivo, (err, data) => {
  if (err) {
    console.log(err);
  } else {
    parser.parseString(data, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        if (result['lista-de-numeros']['numero']) {
          let lista = result['lista-de-numeros']['numero'];
          let suma = 0;
          for (const num of lista) {
            suma += parseInt(num, 10);
          }
          console.log(suma / lista.length);
        } else {
          console.log('La lista de números está vacía');
        }
      }
    });
  }
});