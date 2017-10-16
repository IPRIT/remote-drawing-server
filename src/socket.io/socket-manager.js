import crypto from 'crypto';
import * as utils from '../utils';

export class SocketIoManager {

  /**
   * @type {SocketIoManager}
   * @private
   */
  _instance = null;

  /**
   * @type {string} Use this string to mix with data when hashing
   * @private
   */
  _salt = 'random string';

  /**
   * @type {Namespace} Global namespace
   * @private
   */
  _io = null;

  /**
   * @type {Namespace} socketIoInstance
   */
  static init(socketIoInstance) {
    if (!this._instance) {
      this._instance = new SocketIoManager(socketIoInstance);
    }
  }

  /**
   * @return {SocketIoManager}
   */
  static getInstance() {
    return this._instance;
  }

  /**
   * Private constructor.
   *
   * @param {Namespace} socketIoInstance Namespace instance
   * @private
   */
  constructor(socketIoInstance) {
    this._io = socketIoInstance;
    this.onSocketIoStarted();
  }

  /**
   * On start event
   */
  onSocketIoStarted() {
    this._io.on('connection', this.onNewConnection.bind(this));
  }

  /**
   * @param {Socket} socket
   */
  onNewConnection(socket) {
    this._logMessage(`Socket [${socket.id}] connected.`);
    socket.on('room.join', params => this._joinRoom(socket, params));
    socket.on('disconnect', () => this._disconnect(socket));
  }

  /**
   * @param {number} presentationId
   * @param {string} eventName
   * @param {*} params
   */
  emitChannelEvent(presentationId, eventName, params = {}) {
    this._io.to( this._getRoomChannel(presentationId) )
      .emit(eventName, params);
  }

  /**
   * @param {Socket} socket
   * @param {*} params
   * @private
   */
  _joinRoom(socket, params) {
    let { id } = params;
    socket.join(this._getRoomChannel(id), _ => {
      socket.emit('room.joined');
    });
  }

  /**
   * @param {Socket} socket
   * @private
   */
  _disconnect(socket) {
    this._logMessage(`Socket [${socket.id}] disconnected.`);
  }

  /**
   * @param value
   * @return {string}
   * @private
   */
  _getRoomChannel(value) {
    return utils.md5(`room_` + value);
  }

  /**
   * @param message
   * @param restArgs
   * @private
   */
  _logMessage(message, ...restArgs) {
    let namespace = '[SocketIoManager]';
    console.log(namespace, message + ';', ...restArgs);
  }

  /**
   * @param restArgs
   * @private
   */
  _errorMessage(...restArgs) {
    let namespace = '[SocketIoManager]';
    console.error(namespace, ...restArgs);
  }

  /**
   * @return {Namespace}
   */
  get io() {
    return this._io;
  }
}