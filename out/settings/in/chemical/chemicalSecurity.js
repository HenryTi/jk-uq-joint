"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductExtention = void 0;
const uqs_1 = require("../../../settings/uqs");
exports.ProductExtention = {
    uq: uqs_1.uqs.jkProduct,
    type: 'map',
    entity: 'ChemicalJNKRestrict',
    mapper: {
        product: "ChemicalID@Chemical",
        content: "jnkRestrictID@JNKRestrict",
    },
};
//# sourceMappingURL=chemicalSecurity.js.map