"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uqs_1 = require("../uqs");
exports.Chemical = {
    uq: uqs_1.uqs.jkChemical,
    type: 'tuid',
    entity: 'Chemical',
    key: 'ID',
    mapper: {
        $id: 'ID@Chemical',
        no: "ID",
        CAS: "CAS",
        description: "Description",
        descriptionCN: "DescriptionC",
        molecularFomula: "molFomula",
        molecularWeight: "molWeight",
        mdlNumber: "mdlNumber",
    }
};
//# sourceMappingURL=chemical.js.map