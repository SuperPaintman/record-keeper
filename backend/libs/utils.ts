'use strict';
/** Requires */
import * as sh     from 'shelljs';

import {
  ShExecError
} from './errors';

export function shExecPromise(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    sh.exec(command, {
      silent: true
    }, (code, output, error) => {
      if (code !== 0) {
        const err = new ShExecError(error);
        err.code = code;

        reject(err);
      } else {
        resolve(output);
      }
    });
  });
}

export class AbstractClass {
  constructor(constructor: Function, name?: string) {
    if (!name) {
      name = constructor.name;
    }

    if (this.constructor === AbstractClass) {
      throw new Error(`Cannot create an instance of the abstract class "AbstractClass"`);
    }

    if (this.constructor === constructor) {
      throw new Error(`Cannot create an instance of the abstract class "${name}"`);
    }
  }
}
