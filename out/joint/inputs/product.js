"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const saveTuid_1 = require("../tool/saveTuid");
async function product(data) {
    let mapper = {
        $key: 'no',
        // $import: 'all',
        discription: 'discription',
        packType: 'packType@packType',
        a: false,
        b: true,
        c: true,
    };
    return await saveTuid_1.saveTuid('product', data, mapper);
}
exports.product = product;
//# sourceMappingURL=product.js.map