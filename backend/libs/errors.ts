'use strict';

/**
 * @see https://github.com/loganfsmyth/babel-plugin-transform-builtin-extend
 */
export function extendableBuiltin<T>(constructor: T): T {
  function ExtendableBuiltin() {
    (constructor as any).apply(this, arguments);
  }

  ExtendableBuiltin.prototype = Object.create((constructor as any).prototype, {
    constructor: {
      value: constructor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });

  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(ExtendableBuiltin, constructor);
  } else {
    (ExtendableBuiltin as any).__proto__ = constructor;
  }

  return (ExtendableBuiltin as any);
}

const BuiltinError = extendableBuiltin(Error);

/**
 * @see https://github.com/bjyoungblood/es6-error
 */
export class ExtendableError extends BuiltinError {
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

export interface IConfiguratorErrorOptions {
  configurator: any;
  code?:        string;
}

export class ConfiguratorError extends ExtendableError {
  configurator: any;
  code:         string;

  constructor(message: string = '' , options: IConfiguratorErrorOptions) {
    super(message);

    this.configurator = options.configurator;
    this.code         = options.code;
  }
}
