"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scanIn_1 = require("./scanIn");
const scanOut_1 = require("./scanOut");
const interval = 60 * 1000;
async function startTimer() {
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
        await scanIn_1.scanIn();
        await scanOut_1.scanOut();
    }
    catch (err) {
        console.error('error in timer tick');
        console.error(err);
    }
    finally {
        setTimeout(tick, interval);
    }
}
//# sourceMappingURL=timer.js.map