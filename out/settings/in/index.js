"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = require("./product");
const packType_1 = require("./packType");
const usqs_1 = require("../usqs");
const price = {
    usq: usqs_1.usqs.jkProduct,
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
const price2 = {
    usq: usqs_1.usqs.jkProduct,
    type: 'map',
    entity: 'price',
    mapper: {
        product: '@product',
        arr1: {
            packType: '^@packType',
            retail: '^',
        }
    }
};
const _in = {
    'product': product_1.product,
    'product.pack': product_1.productPack,
    'packType': packType_1.packType,
    'price': price,
    'price-2': price2,
};
exports.default = _in;
//# sourceMappingURL=index.js.map