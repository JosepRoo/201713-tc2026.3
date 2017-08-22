// Programa que demuestra el uso de sockets.
// Basado en el código provisto en la documentación
// de node.

'use strict';

const net = require('net');
const PUERTO = 8080;
let id = 0;

const server = net.createServer((socket) => {

  let socket_id = id;
  id++;
  console.log('client connected ' + socket_id);

  socket.on('end', () => {
    console.log('client disconnected ' + socket_id);
  });

  socket.on('data', (data) => {
    let entrada = data.toString().trim();
    if (entrada === 'bye') {
      socket.end();
    } else {
      console.log(socket_id + ": " + entrada);
      socket.write('Ok\n');
    }
  });
});

server.on('error', (err) => {
  throw err;
});

server.listen(PUERTO, () => {
  console.log('server bound on port ' + PUERTO);
});
