"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uqs_1 = require("../uqs");
exports.product = {
    uq: uqs_1.us.jkProduct,
    type: 'tuid',
    entity: 'product',
    key: 'no',
    mapper: {
        discription: 'discription',
        packType: 'packType@packType',
        a: false,
        b: true,
        c: true,
    }
};
exports.productPack = {
    uq: uqs_1.us.jkProduct,
    type: 'tuid-arr',
    entity: 'product.pack',
    key: 'no',
    owner: 'prodNo',
    mapper: {
        ratio: true,
        name: true,
    }
};
//# sourceMappingURL=product.js.map