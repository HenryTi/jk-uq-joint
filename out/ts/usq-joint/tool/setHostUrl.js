"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("config"));
const usqHost = config_1.default.get('usqhost');
function urlSetUsqHost(url) {
    return url.replace('://usqhost/', '://' + usqHost + '/');
}
exports.urlSetUsqHost = urlSetUsqHost;
const unitxHost = config_1.default.get('unitxhost');
function urlSetUnitxHost(url) {
    return url.replace('://unitxhost/', '://' + unitxHost + '/');
}
exports.urlSetUnitxHost = urlSetUnitxHost;
//# sourceMappingURL=setHostUrl.js.map