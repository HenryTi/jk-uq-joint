"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inputs_1 = require("./inputs");
const tool_1 = require("../db/mysql/tool");
const tool_2 = require("./tool");
async function scanInput() {
    for (let i in inputs_1.inputs) {
        console.log('scan input ', i);
        for (;;) {
            let retp = await tool_1.tableFromProc('read_queue_in', [i]);
            if (!retp || retp.length === 0)
                break;
            let { id, body, date } = retp[0];
            let func = inputs_1.inputs[i];
            if (typeof func === 'function')
                await func(body);
            else
                await tool_2.saveTuid(i, body, func);
            console.log(`process in ${id} ${date.toLocaleString()}: `, body);
            await tool_1.execProc('write_queue_in_p', [i, id]);
        }
    }
}
exports.scanInput = scanInput;
//# sourceMappingURL=scanInput.js.map