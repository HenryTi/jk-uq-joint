import { configure, getLogger } from 'log4js';
import config from 'config';

configure(config.get<any>('log4js'));

const logger = getLogger('joint');

export { logger }