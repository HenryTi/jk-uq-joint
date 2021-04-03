"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeAsQueue = void 0;
const config_1 = __importDefault(require("config"));
const uqOutRead_1 = require("../first/converter/uqOutRead");
const interval = config_1.default.get("interval");
async function timeAsQueue(sql, queue, lastLength) {
    let topn = 30;
    topn += lastLength;
    sql = sql.replace('--topn--', topn.toString());
    console.log(sql);
    let ret = await uqOutRead_1.uqOutRead(sql, queue);
    if (ret !== undefined) {
        let { lastPointer, data } = ret;
        data.splice(0, lastLength);
        let lastL = data.filter(e => e.ID === lastPointer).length;
        if (lastL === 0)
            ret = undefined;
        else {
            if (queue === lastPointer)
                lastLength += lastL;
            else
                lastLength = lastL;
        }
    }
    if (ret !== undefined)
        return { lastLength: lastLength, ret: ret };
}
exports.timeAsQueue = timeAsQueue;
//# sourceMappingURL=timeAsQueue.js.map