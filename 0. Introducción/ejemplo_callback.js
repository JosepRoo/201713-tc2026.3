'use strict';

const fs = require('fs');

function invocaDoble(f) {
  return f(f(5));
}

console.log('Antes de setTimeout');
setTimeout(function () {
  console.log('Algo pasó.');
}, 2000);
console.log('Después de setTimeout');
console.log(invocaDoble(function (x) {
  return x * 2; 
}));

fs.readFile('ejemplo.txt', (err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.log(data.toString());
  }
});

console.log('Última línea del archivo.');
