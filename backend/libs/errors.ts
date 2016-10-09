'use strict';

/**
 * @see https://github.com/bjyoungblood/es6-error
 */
export class ExtendableError extends Error {
  constructor(message: string = '') {
    super(message);

    Object.defineProperty(this, 'message', {
      configurable: true,
      enumerable: false,
      value: message,
      writable: true
    });

    Object.defineProperty(this, 'name', {
      configurable: true,
      enumerable: false,
      value: this.constructor.name,
      writable: true
    });

    if (Error.hasOwnProperty('captureStackTrace')) {
      Error.captureStackTrace(this, (this.constructor as any));
      return;
    }

    Object.defineProperty(this, 'stack', {
      configurable: true,
      enumerable: false,
      value: new Error(message).stack,
      writable: true
    });
  }
}

export class ShExecError extends ExtendableError {
  code: number;
}
