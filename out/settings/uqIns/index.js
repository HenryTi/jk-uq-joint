"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = require("./product");
const packType_1 = require("./packType");
const uqs_1 = require("../uqs");
const price = {
    uq: uqs_1.us.jkProduct,
    type: 'map',
    entity: 'price',
    mapper: {
        product: '@product',
        arr1: {
            pack: '@product.pack',
            retail: true,
        }
    }
};
/*
const price2: UqInMap = {
    uq: uqs.jkProduct,
    type: 'map',
    entity: 'price',
    mapper: {
        product: '@product',
        arr1: {
            packType: '^@packType',
            retail: '^',
        }
    }
}
*/
const _in = [
    product_1.product,
    product_1.productPack,
    packType_1.packType,
    price,
];
exports.default = _in;
//# sourceMappingURL=index.js.map