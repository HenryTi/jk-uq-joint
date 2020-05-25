"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationVIPLevel = void 0;
const uqs_1 = require("../uqs");
exports.OrganizationVIPLevel = {
    uq: uqs_1.uqs.jkVIPCardType,
    type: 'map',
    entity: 'OrganizationVIPLevel',
    mapper: {
        organization: "OrganizationID@Organization",
        arr1: {
            vipCardLevel: "^VIPLevel",
        }
    },
};
//# sourceMappingURL=VIPCardLevel.js.map