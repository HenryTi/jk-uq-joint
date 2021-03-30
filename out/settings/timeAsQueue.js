"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeAsQueue = void 0;
const config_1 = __importDefault(require("config"));
const uqOutRead_1 = require("../first/converter/uqOutRead");
const interval = config_1.default.get("interval");
async function timeAsQueue(sql, queue, step_seconds) {
    if (!step_seconds)
        step_seconds = Math.max(interval * 10 / 1000, 300);
    if ((queue - 8 * 60 * 60 + step_seconds) * 1000 > Date.now())
        return undefined;
    let nextQueue = queue + step_seconds;
    let ret = await uqOutRead_1.uqOutRead(sql, queue, nextQueue);
    if (ret === undefined) {
        ret = { lastPointer: nextQueue, data: [] };
    }
    return ret;
}
exports.timeAsQueue = timeAsQueue;
//# sourceMappingURL=timeAsQueue.js.map