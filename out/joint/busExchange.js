"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tool_1 = require("../db/mysql/tool");
;
async function busExchange(req, res) {
    let tickets = req.body;
    if (Array.isArray(tickets) === false)
        tickets = [tickets];
    let ret = [];
    for (let ticket of tickets) {
        let { moniker, queue, data } = ticket;
        if (moniker === undefined)
            continue;
        if (data !== undefined) {
            await tool_1.execProc('write_queue', [1, moniker, JSON.stringify(data)]);
        }
        else {
            let q = Number(queue);
            if (Number.isNaN(q) === false) {
                let readQueue = await tool_1.tableFromProc('read_queue', [0, moniker, q]);
                if (readQueue.length > 0) {
                    ret.push(readQueue[0]);
                }
            }
        }
    }
    res.json(ret);
}
exports.busExchange = busExchange;
//# sourceMappingURL=busExchange.js.map