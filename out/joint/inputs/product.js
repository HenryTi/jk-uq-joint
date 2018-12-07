"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tuid_1 = require("../tool/tuid");
async function product(data) {
    let mapper = {
        $key: 'no',
        $import: 'all',
        discription: 'disc',
        packType: 'pk@packType',
    };
    return await tuid_1.saveTuid('product', data, mapper);
}
exports.product = product;
//# sourceMappingURL=product.js.map