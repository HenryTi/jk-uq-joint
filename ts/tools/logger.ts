import { configure, getLogger } from 'log4js';

const logger = getLogger();
logger.level = 'debug'; // default level is OFF - which means no logs at all.

export { logger }