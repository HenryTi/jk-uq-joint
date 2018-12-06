"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const usqs_1 = require("./usqs");
const tool_1 = require("../db/mysql/tool");
async function scanUsq() {
    for (let i in usqs_1.usqs) {
        console.log('scan usq ', i);
        for (;;) {
            let queue;
            let retp = await tool_1.tableFromProc('read_queue_out_p', [i]);
            if (retp.length === 0)
                queue = 0;
            else
                queue = retp[0].queue;
            let func = usqs_1.usqs[i];
            let retUsq = await func(queue);
            if (retUsq === undefined)
                break;
            let { queue: retQueue, data } = retUsq;
            await tool_1.execProc('write_queue_out', [i, retQueue, JSON.stringify(data)]);
            console.log(`usq queue ${retQueue}`, data);
        }
    }
}
exports.scanUsq = scanUsq;
//# sourceMappingURL=scanUsq.js.map