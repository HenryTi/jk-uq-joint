"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChemicalSynonmity = void 0;
const uqs_1 = require("settings/uqs");
exports.ChemicalSynonmity = {
    uq: uqs_1.uqs.jkChemical,
    type: 'map',
    entity: 'ChemicalSynonmity',
    mapper: {
        chemical: "ChemicalID@Chemical",
        arr1: {
            language: '^LanugageID@Language',
            synonmity: 'Synonmity'
        }
    }
};
//# sourceMappingURL=chemicalSynonymity.js.map