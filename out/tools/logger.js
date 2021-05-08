"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const log4js_1 = require("log4js");
const config_1 = __importDefault(require("config"));
log4js_1.configure(config_1.default.get('log4js'));
const logger = log4js_1.getLogger('joint');
exports.logger = logger;
//# sourceMappingURL=logger.js.map