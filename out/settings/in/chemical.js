"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageCondition = exports.Chemical = void 0;
const uqs_1 = require("../uqs");
const config_1 = __importDefault(require("config"));
const storageConditionPullWrite_1 = require("../../first/converter/storageConditionPullWrite");
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
exports.StorageCondition = {
    uq: uqs_1.uqs.jkChemical,
    type: 'tuid',
    entity: 'StorageCondition',
    key: 'ID',
    mapper: {
        $id: 'ID@StorageCondition',
        no: "CodeST",
        name: "DescriptionST"
    },
    pull: ` SELECT  TOP ${promiseSize} ID, CodeST, DescriptionST
            FROM    ProdData.dbo.Export_Storage
            WHERE   ID > @iMaxId
            ORDER BY ID`,
    pullWrite: storageConditionPullWrite_1.StorageConditionPullWrite
};
//# sourceMappingURL=chemical.js.map