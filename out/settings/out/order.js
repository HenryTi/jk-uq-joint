"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const usqs_1 = require("../usqs");
exports.order = {
    usq: usqs_1.usqs.jkOrder,
    type: 'sheet',
    entity: 'order',
    key: 'no',
    mapper: {
        $all: true,
    }
};
//# sourceMappingURL=order.js.map