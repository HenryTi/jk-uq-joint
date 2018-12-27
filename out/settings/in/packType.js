"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const usqs_1 = require("../usqs");
exports.PackType = {
    usq: usqs_1.usqs.jkCommon,
    type: 'tuid',
    entity: 'PackType',
    key: 'ID',
    mapper: {
        no: 'ID',
        name: 'unitE',
        description: "unitC"
    }
};
exports.PackTypeMapToStandard = {
    usq: usqs_1.usqs.jkCommon,
    type: 'map',
    entity: "PackTypeMapToStandard",
    mapper: {
        packType: "ID@PackType",
        packTypeStandard: "standardUnitID",
    }
};
exports.PackTypeStandard = {
    usq: usqs_1.usqs.jkCommon,
    type: 'tuid',
    entity: 'PackTypeStandard',
    key: 'ID',
    mapper: {
        no: "ID",
        name: 'unit',
        class: "name"
    }
};
//# sourceMappingURL=packType.js.map