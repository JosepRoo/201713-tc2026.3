//---------------------------------------------------------
// Solución al problema 1.
//---------------------------------------------------------

'use strict';

const net = require('net');
const PUERTO = process.env['PORT'] || 8080;

const server = net.createServer((socket) => {

  console.log('Cliente conectado');

  socket.on('end', () => {
    console.log('Cliente desconectado');
  });

  let acumulado = 0;

  socket.on('data', (data) => {
    let entrada = data.toString().trim();
    if (entrada === 'fin') {
      socket.end(`Total: ${ acumulado }\n`);
    } else if (/^\d+$/.test(entrada)) {
      acumulado += parseInt(entrada, 10);
      socket.write(`Acumulado: ${ acumulado }\n`);
    } else {
      socket.write('Valor no reconocido\n');
    }
  });

});

server.on('error', (err) => {
  throw err;
});

server.listen(PUERTO, () => {
  console.log('Servidor escuchando en puerto ' + PUERTO);
});