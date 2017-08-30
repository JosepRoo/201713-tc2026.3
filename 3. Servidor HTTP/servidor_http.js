// Ejemplo de servidor HTTP usando sockets.

'use strict';

const net = require('net');
const PUERTO = process.env['PORT'] || '8080';

const MENSAJE = new Buffer('¡Este niño está muy ñoño!');

const server = net.createServer((socket) => {

  console.log('client connected');

  socket.on('data', (data) => {
    socket.write(
`HTTP/1.1 200 Ok
Server: MicroServerNode/0.1
Date: ${ new Date().toUTCString() }
Content-Type: text/plain; charset=utf-8
Content-Length: ${ MENSAJE.length }

`
    );
    socket.write(MENSAJE);
    socket.end();
  });
});

server.on('error', (err) => {
  throw err;
});

server.listen(PUERTO, () => {
  console.log('HTTP server bound on port ' + PUERTO);
});
