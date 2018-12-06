"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const map_1 = require("./map");
const openApi_1 = require("./openApi");
exports.consts = {
    unit: 27,
    allowedIP: [
        '218.249.142.140',
        '211.5.7.60'
    ],
};
async function saveTuid(tuid, no, data) {
    let id = 33;
    let openApi = await openApi_1.getOpenApi('JKDev/jkProduct', exports.consts.unit);
    let ret = await openApi.tuid(exports.consts.unit, 2, 'product', undefined);
    await map_1.map(tuid, id, no);
}
exports.saveTuid = saveTuid;
//# sourceMappingURL=tool.js.map