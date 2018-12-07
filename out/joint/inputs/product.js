"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tuid_1 = require("../tool/tuid");
async function product(data) {
    // tranfer data, no => id
    let key = data['no'] || '333';
    let pk = data['packType'];
    let body = {
        discription: 'kkk',
        packType: { tuid: 'packType', val: pk },
    };
    return await tuid_1.saveTuid('product', key, body);
}
exports.product = product;
//# sourceMappingURL=product.js.map