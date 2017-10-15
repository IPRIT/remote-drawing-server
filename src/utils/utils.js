import { typeCheck as isType } from 'type-check';
import * as models from '../models';
import crypto from 'crypto';
import querystring from 'querystring';
import url from 'url';
import Promise from 'bluebird';
import * as TimSort from 'timsort';

export function generateCryptoToken(bufferLength = 48) {
  let getRandomBytes = Promise.promisify(crypto.randomBytes);
  return getRandomBytes(bufferLength).then(buffer => {
    return buffer.toString('hex');
  });
}

export function generateShaString(bufferLength = 48) {
  let getRandomBytes = Promise.promisify(crypto.randomBytes);
  return getRandomBytes(bufferLength).then(buffer => {
    return sha256( buffer.toString('hex') );
  });
}

export function md5(value) {
  return crypto.createHash('md5').update(value).digest('hex');
}

export function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('base64');
}

/**
 * @param {string} token
 * @return {Presentation}
 */
export async function getPresentationByAuthToken( token ) {
  let authToken = await models.AuthToken.findOne({
    where: {
      token
    },
    include: [ models.Presentation ]
  });
  if (!authToken) {
    throw new HttpError('Invalid token');
  }
  return authToken.Presentation;
}

export function getSymbolIndex(index) {
  let [ alphabetLength, symbolIndex ] = [ 26, '' ];
  while (index >= 0) {
    symbolIndex += String.fromCharCode( index % alphabetLength + 0x61 );
    index = Math.floor(index / alphabetLength) - 1;
  }
  return symbolIndex.split('').reverse().join('');
}

export function getIntegerIndex(symbolIndex) {
  let [ alphabetLength, index, symbolNumber ] = [ 26, 0, 0 ];
  let symbolIndexArray = symbolIndex.toLowerCase().split('').reverse();
  while (symbolIndexArray.length) {
    let symbol = symbolIndexArray.shift();
    index += ( symbol.charCodeAt(0) - 0x60 ) * Math.pow(alphabetLength, symbolNumber++);
  }
  return index - 1;
}

export function valueBetween(value, min = -Infinity, max = Infinity) {
  if (min > max) {
    [ min, max ] = [ max, min ];
  }
  return Math.min(
    Math.max(Number(value), min),
    max
  );
}

export function extractParam(str, key) {
  if (typeof str !== 'string' || typeof key !== 'string') {
    return null;
  }
  return querystring.parse(url.parse(str).query)[ key ];
}

export function ensureNumber(value) {
  value = Number(value);
  if (Number.isNaN(value)) {
    return 0;
  }
  return value;
}

/**
 * @description Finds boundary indexes for element in array
 * @param {*[]} array
 * @param {number} value
 * @param {string} key
 * @param {number} order
 * @return {[number, number]} Indexes
 * @private
 */
export function binarySearchIndexes(array, value, key, order = -1) {
  let [ left, right ] = [ 0, array.length - 1 ];
  if (!array.length || order * value < order * array[ left ][ key ]) {
    return [ -1, 0 ];
  } else if (order * value > order * array[ right ][ key ]) {
    return [ right, right + 1 ];
  }
  while (right - left > 1) {
    let mid = (left + right) >>> 1;
    if (order * value <= order * array[ mid ][ key ]) {
      right = mid;
    } else {
      left = mid;
    }
  }
  if (array[ right ][ key ] === value) {
    left = right;
  } else if (array[ left ][ key ] === value) {
    right = left;
  }
  return [ left, right ];
}

/**
 * @param object
 * @return {Array}
 * @private
 */
export function flattenObjectValues(object) {
  let objectValues = [];
  for (let key in object) {
    if ( isVarTypeOf(object[ key ], Object) ) {
      objectValues.push(...flattenObjectValues(object[ key ]));
    } else if (isVarTypeOf(object[ key ], Array)) {
      for (let value of object[ key ]) {
        objectValues.push(...flattenObjectValues( value ));
      }
    } else {
      objectValues.push( object[ key ] );
    }
  }
  return objectValues;
}

/**
 * @param object
 * @return {Array}
 * @private
 */
export function arrayifyObjectValues( object ) {
  let objectValues = [];
  for (let key in object) {
    if ( isVarTypeOf(object[ key ], Object) ) {
      objectValues.push(flattenObjectValues(object[ key ]));
    } else if (isVarTypeOf(object[ key ], Array)) {
      for (let value of object[ key ]) {
        objectValues.push(flattenObjectValues( value ));
      }
    } else {
      objectValues.push( object[ key ] );
    }
  }
  return objectValues;
}

/**
 * @param _var
 * @param _type
 * @return {boolean}
 */
export function isVarTypeOf(_var, _type){
  try {
    return _var.constructor === _type;
  } catch(ex) {
    return _var == _type;
  }
}

/**
 * @description Finds boundary indexes for element in array
 * @param {*[]} array
 * @param {number} value
 * @param {string} factor
 * @param {number} order
 * @return {[number, number]} Indexes
 * @private
 */
export function binarySearchIndexesByFactor(array, value, factor) {
  let [ left, right ] = [ 0, array.length - 1 ];
  if (!array.length || value < array[ left ].factor[ factor ]) {
    return [ -1, 0 ];
  } else if (value > array[ right ].factor[ factor ]) {
    return [ right, right + 1 ];
  }
  while (right - left > 1) {
    let mid = (left + right) >>> 1;
    if (value <= array[ mid ].factor[ factor ]) {
      right = mid;
    } else {
      left = mid;
    }
  }
  if (Math.abs(array[ right ].factor[ factor ] - value) < 1e-7) {
    left = right;
  } else if (Math.abs(array[ left ].factor[ factor ] - value) < 1e-7) {
    right = left;
  }
  return [ left, right ];
}

export function timSort(arr, cmp) {
  TimSort.sort(arr, cmp);
}

export function getEndpoint(host, pathTo = '/', params = {}, qs = {}, protocol = 'http') {
  let uri = `${protocol}://${host}${pathTo}`;
  for (let param in params) {
    uri = uri.replace(new RegExp(`(\:${param})`, 'gi'), params[ param ]);
  }
  let qsArray = [];
  for (let param in qs) {
    qsArray.push(`${param}=${qs[param]}`);
  }
  if (qsArray.length) {
    uri += '?' + qsArray.join('&');
  }
  return uri;
}

export function capitalize(string = '') {
  return string.split(/\s+/)
    .map(part => part.toLowerCase())
    .map(part => {
      return part.slice(0, 1).toUpperCase() + part.slice(1)
    })
    .join(' ');
}

export function assignGroup(object, ...restArgs) {
  restArgs.forEach(arg => Object.assign(object, arg));
  return object;
}

export function extractAllParams(req) {
  return assignGroup(req.body, req.query, req.params, { user: req.user });
}

export class AsyncQueue {
  queue = [];
  inProcess = false;

  wait(element, cb) {
    return new Promise(resolve => {
      this.queue.push([ element, cb, resolve ]);
      this.added();
    })
  }

  added() {
    if (this.inProcess) {
      return;
    }
    this.process();
  }

  async process() {
    this.inProcess = true;
    let queuedElement;
    while (queuedElement = this.queue.shift()) {
      let [ element, process, resolver ] = queuedElement;
      resolver(await process(element));
    }
    this.inProcess = false;
  }
}

export function ensureValue(actual, type, defaultValue, fn = () => {}) {
  const regOppositeExpression = /\^\((.+)\)/i;

  let isOppositeType = type.startsWith('^');
  if (isOppositeType) {
    type = type.replace(regOppositeExpression, '$1');
  }
  let isProperlyType = isType(type, actual);
  if (isOppositeType) {
    isProperlyType = !isProperlyType;
  }
  if (!isProperlyType) {
    actual = defaultValue;
  }
  try {
    let regulatedValue = fn(actual, defaultValue);
    return isType('Undefined', regulatedValue) ?
      actual : regulatedValue;
  } catch (err) {
    return defaultValue;
  }
}