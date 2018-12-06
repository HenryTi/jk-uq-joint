"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tool_1 = require("../tool/tool");
async function product(data) {
    // tranfer data, no => id
    let no = data['no'] || '333';
    await tool_1.saveTuid('product', no, data);
}
exports.product = product;
//# sourceMappingURL=product.js.map