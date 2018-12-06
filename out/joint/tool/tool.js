"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const map_1 = require("./map");
exports.consts = {
    unit: 24,
    allowedIP: [
        '218.249.142.140'
    ],
};
async function saveTuid(tuid, no, data) {
    let id = 33;
    await map_1.map(tuid, id, no);
}
exports.saveTuid = saveTuid;
//# sourceMappingURL=tool.js.map