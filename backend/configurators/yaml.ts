'use strict';
/** Requires */
import * as yaml   from 'js-yaml';

import Configurator, {
  IConfig
} from './configurator';

import {
  ConfiguratorError
} from '../libs/errors';

export default class Yaml extends Configurator {
  get extensions() {
    return ['yaml', 'yml'];
  }

  load(config: string): Promise<IConfig> {
    let configObj: IConfig;

    try {
      configObj = yaml.load(config);
    } catch (err) {
      return Promise.reject(err);
    }

    return Promise.resolve(configObj);
  }

  formatError(err: any): ConfiguratorError {
    return new ConfiguratorError(err.message, {
      configurator: Yaml,
      code: err.mark ? err.mark.buffer : undefined
    });
  }
}
