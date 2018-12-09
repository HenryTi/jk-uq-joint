"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import { inputs } from './inputs';
const tool_1 = require("../db/mysql/tool");
const tool_2 = require("./tool");
const settings_1 = require("./settings");
async function scanIn() {
    for (let i in settings_1.settings.in) {
        console.log('scan in ', i);
        let usqIn = settings_1.settings.in[i];
        for (;;) {
            let retp = await tool_1.tableFromProc('read_queue_in', [i]);
            if (!retp || retp.length === 0)
                break;
            let { id, body, date } = retp[0];
            let data = JSON.parse(body);
            if (typeof usqIn === 'function')
                await usqIn(data);
            else {
                let { type } = usqIn;
                switch (type) {
                    case 'tuid':
                        await tool_2.mapToTuid(usqIn, data);
                        break;
                }
            }
            console.log(`process in ${id} ${date.toLocaleString()}: `, body);
            await tool_1.execProc('write_queue_in_p', [i, id]);
        }
    }
}
exports.scanIn = scanIn;
//# sourceMappingURL=scanIn.js.map