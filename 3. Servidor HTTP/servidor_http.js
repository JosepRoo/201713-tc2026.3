// Ejemplo de servidor HTTP usando sockets.

'use strict';

const net = require('net');
const fs = require('fs');
const PUERTO = process.env['PORT'] || '8080';

const MENSAJE = new Buffer(
`<h1>404 Not Found</h1>
<p>
  El recurso solicitado no pudo ser encontrado. ¡Menso!
</p>
`);

const server = net.createServer((socket) => {

  socket.on('data', (data) => {
    let entrada = data.toString();
    let lineas = entrada.split('\r\n');
    let lineaPeticion = lineas[0];
    let peticion = lineaPeticion.split(' ');
    let metodo = peticion[0];
    let recurso = peticion[1];
    let protocolo = peticion[2];
    console.log(lineaPeticion);
    
    fs.readFile(recurso.substring(1), (err, data) => {
      if (err) {
        socket.write(
`HTTP/1.1 404 Not Found
Server: MicroServerNode/0.1
Date: ${ new Date().toUTCString() }
Content-Type: text/html; charset=UTF-8
Content-Length: ${ MENSAJE.length }

`);
        socket.write(MENSAJE);
        socket.end();
      } else {
        socket.write(
`HTTP/1.1 200 Ok
Server: MicroServerNode/0.1
Date: ${ new Date().toUTCString() }
Content-Type: image/png
Content-Length: ${ data.length }

`);
        socket.write(data);
        socket.end();
      }
    });
  });
});

server.on('error', (err) => {
  throw err;
});

server.listen(PUERTO, () => {
  console.log(process.env['C9_HOSTNAME']);
  console.log('HTTP server bound on port ' + PUERTO);
});
