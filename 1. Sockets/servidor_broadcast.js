// Broadcast con sockets.
// Lo que un cliente envía se re-envía a los
// demás clientes.

'use strict';

const net = require('net');
const PUERTO = 8080;
const socketes = [];
let id = 0;


const server = net.createServer((socket) => {

  socket.id = id;
  socketes.push(socket);
  id++;
  console.log('client connected ' + socket.id);

  socket.on('end', () => {
    console.log('client disconnected ' + socket.id);
    const indice = socketes.indexOf(socket);
    socketes.splice(indice, 1);
  });

  socket.on('data', (data) => {
    let entrada = data.toString().trim();
    if (entrada === 'bye') {
      socket.end();
    } else {
      for (const s of socketes) {
        if (socket !== s) {
          s.write(socket.id + ': ' + entrada + '\n');
        }
      }
    }
  });
});

server.on('error', (err) => {
  throw err;
});

server.listen(PUERTO, () => {
  console.log('server bound on port ' + PUERTO);
});
