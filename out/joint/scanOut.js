"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import { usqs } from './usqs'
const tool_1 = require("../db/mysql/tool");
const settings_1 = require("./settings");
const mapFromSheet_1 = require("./tool/mapFromSheet");
async function scanOut() {
    for (let i in settings_1.settings.out) {
        console.log('scan out ', i);
        let usqOut = settings_1.settings.out[i];
        for (;;) {
            let queue;
            let retp = await tool_1.tableFromProc('read_queue_out_p', [i]);
            if (retp.length === 0)
                queue = 0;
            else
                queue = retp[0].queue;
            /*
            let data = {id: queue};
            let {id} = data;

            // 中断queue
            if (id <= queue) break;
            */
            let ret;
            if (typeof usqOut === 'function')
                ret = await usqOut(queue);
            else {
                let { type } = usqOut;
                switch (type) {
                    case 'sheet':
                        ret = await mapFromSheet_1.mapFromSheet(usqOut, queue);
                        break;
                }
            }
            if (ret === undefined)
                break;
            let { queue: newQueue, data } = ret;
            await tool_1.execProc('write_queue_out', [i, newQueue, JSON.stringify(data)]);
            //await execProc('write_queue_out_p', [i, newQueue]);
        }
    }
}
exports.scanOut = scanOut;
//# sourceMappingURL=scanOut.js.map