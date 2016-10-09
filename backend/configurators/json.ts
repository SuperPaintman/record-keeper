'use strict';
/** Requires */
import Configurator, {
  IConfig
} from './configurator';

import {
  ConfiguratorError
} from '../libs/errors';

export default class Json extends Configurator {
  get extensions() {
    return ['json'];
  }

  load(config: string): Promise<IConfig> {
    let configObj: IConfig;

    try {
      configObj = JSON.parse(config);
    } catch (err) {
      return Promise.reject(err);
    }

    return Promise.resolve(configObj);
  }

  formatError(err: any): ConfiguratorError {
    return new ConfiguratorError(err.message, {
      configurator: Json
    });
  }
}
