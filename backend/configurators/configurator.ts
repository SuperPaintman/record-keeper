'use strict';
/** Requires */
import * as Joi    from 'joi';

import {
  ConfiguratorError
} from '../libs/errors';

import {
  AbstractClass
} from '../libs/utils';

export interface IConfig {
  version: number;
}

export const configSchema = Joi.object().keys({
  version: Joi
    .number()
    .integer()
    .min(0)
    .default(0)
});

abstract class Configurator extends AbstractClass {
  abstract get extensions(): string[];

  constructor() {
    super(Configurator, 'Configurator');
  }

  abstract load(config: string): Promise<IConfig>;

  abstract formatError(err: any): ConfiguratorError;
}

export default Configurator;
