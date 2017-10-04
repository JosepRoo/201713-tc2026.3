'use strict';

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('super.dat');

db.each("SELECT * FROM superheroes ORDER BY nombre", function(err, row) {
  if (err) {
    console.log(err);
  } else {
    console.log(row.nombre);
  }
  db.close();
});
