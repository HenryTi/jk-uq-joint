"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const usqs_1 = require("../usqs");
exports.Chemical = {
    usq: usqs_1.usqs.jkChemical,
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