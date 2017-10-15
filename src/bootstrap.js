/**
 * Module dependencies.
 */

import app from './app';
import http from 'http';
//import socketIo from 'socket.io';
//import * as sockets from './socket';
import { config } from './utils';
import { SocketIoManager } from "./socket.io";

/**
 * Get port from environment and store in Express.
 */

let port = normalizePort(config.port);
app.set('port', port);
app.set('env', config.env);

/**
 * Create HTTP server.
 */

let server = http.createServer(app);
let io = require('socket.io')(server);
SocketIoManager.init( io );

/**
 * Listen on provided port, on all network interfaces.
 */
if (config.ip) {
  server.listen(port, config.ip);
} else {
  server.listen(port);
}

server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  
  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;
  
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  let addr = server.address();
  let bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log(`Listening on ${bind} [in ${process.env.NODE_ENV || 'unknown'} mode].`);
}