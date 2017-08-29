// Ejemplo de parseo de un documento XML.

'use strict';

const fs = require('fs');
const xml2js = require('xml2js');

let parser = new xml2js.Parser();

fs.readFile('movies.xml', (err, data) => {
  if (err) {
    console.log(err);
  } else {
    parser.parseString(data, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        // console.log(JSON.stringify(result));
        console.log(result['movies']['film'][0]['$']['name']);
      }
    });
  }
});