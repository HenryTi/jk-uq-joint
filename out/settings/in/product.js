"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const usqs_1 = require("../usqs");
exports.product = {
    usq: usqs_1.usqs.jkProduct,
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
    usq: usqs_1.usqs.jkProduct,
    type: 'tuid-arr',
    entity: 'product.pack',
    key: 'no',
    owner: 'packNo@product',
    mapper: {
        discription: 'discription',
        packType: 'packType@packType',
        a: false,
        b: true,
        c: true,
    }
};
//# sourceMappingURL=product.js.map