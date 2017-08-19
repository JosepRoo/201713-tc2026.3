// Programa que demuestra el uso de sockets.
// Basado en el código provisto en la documentación
// de node.

'use strict';

const net = require('net');

const server = net.createServer((socket) => {

  console.log('client connected');

  socket.on('end', () => {
    console.log('client disconnected');
  });

  socket.on('data', (data) => {
    console.log(data.toString().trim());
    socket.write('Ok\n');
  });
});

server.on('error', (err) => {
  throw err;
});

server.listen(8124, () => {
  console.log('server bound');
});
