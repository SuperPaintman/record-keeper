'use strict';
/** Requires */
import * as vm         from 'vm';

import * as _          from 'lodash';
import * as livescript from 'livescript';

import Configurator, {
  IConfig
} from './configurator';

import {
  ConfiguratorError
} from '../libs/errors';

const sandboxDefault = {
  _:          _,
  livescript: livescript,
  exports: {},
  module: {
    exports: {}
  },
  require(name: string): any {
    const availableModules = [
      'livescript',
      'lodash'
    ];

    if (!_.includes(availableModules, name)) {
      throw new Error(`"${name}" module is not available`);
    }

    return require(name);
  }
};

const configWrapper = new vm.Script(`
module.exports = exports;
eval(livescript.compile(config));
`);

export default class LiveScript extends Configurator {
  get extensions() {
    return ['ls'];
  }

  load(config: string): Promise<IConfig> {
    const sandbox = _.merge(_.cloneDeep(sandboxDefault), {
      config
    });

    const context = vm.createContext(sandbox);

    try {
      configWrapper.runInContext(context, {
        displayErrors: false
      });
    } catch (err) {
      return Promise.reject(err);
    }

    const configObj: IConfig = (sandbox.module.exports as IConfig);

    return Promise.resolve(configObj);
  }

  formatError(err: any): ConfiguratorError {
    return new ConfiguratorError(err.message, {
      configurator: LiveScript
    });
  }
}
