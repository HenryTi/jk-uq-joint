"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scanInput_1 = require("./scanInput");
const scanUsq_1 = require("./scanUsq");
const createMapTables_1 = require("./tool/createMapTables");
const interval = 60 * 1000;
async function startTimer() {
    await createMapTables_1.createMapTables();
    setTimeout(tick, 3 * 1000);
}
exports.startTimer = startTimer;
function wait(minutes) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, minutes * 60 * 1000);
    });
}
async function tick() {
    try {
        console.log('tick ' + new Date().toLocaleString());
        await scanInput_1.scanInput();
        await scanUsq_1.scanUsq();
    }
    catch (err) {
        console.error('timer error');
        console.log(err && err.message);
    }
    finally {
        setTimeout(tick, interval);
    }
}
//# sourceMappingURL=timer.js.map