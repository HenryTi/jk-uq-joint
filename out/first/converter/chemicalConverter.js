"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
exports.readChemical = async (maxId) => {
    let iMaxId = maxId === "" ? 0 : Number(maxId);
    let sqlstring = `select top 1 chemID as ID, cas, Description, DescriptionC, molWeight, molFomula, mdlNumber
        from opdata.dbo.sc_chemical where reliability = 0 and chemID > '${iMaxId}' order by chemID`;
    return await _1.read(sqlstring);
};
//# sourceMappingURL=chemicalConverter.js.map