"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chemical = void 0;
const uqs_1 = require("../uqs");
const config_1 = __importDefault(require("config"));
const promiseSize = config_1.default.get("promiseSize");
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
        molecularFomula: "MolFomula",
        molecularWeight: "MolWeight",
        mdlNumber: "MdlNumber",
    },
    pull: ` select top ${promiseSize} chemID as ID, CAS, Description, DescriptionC, MolWeight, MolFomula, MdlNumber
            from opdata.dbo.sc_chemical
            where reliability = 0 and chemID > @iMaxId order by chemID`
};
//# sourceMappingURL=chemical.js.map