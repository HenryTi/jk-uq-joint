"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const in_1 = require("./in");
const out_1 = require("./out");
exports.settings = {
    unit: 27,
    allowedIP: [
        '218.249.142.140',
        '211.5.7.60'
    ],
    /*
    usqs: {
        'JKDev/jkProduct': {
            'tuid': {
                'product': {write: product},
                'packType': {write: packType},
            }
        }
    },
    */
    in: {
        'product': in_1.product,
        'packType': in_1.packType,
    },
    out: {
        'order': out_1.order,
    }
};
//# sourceMappingURL=settings.js.map