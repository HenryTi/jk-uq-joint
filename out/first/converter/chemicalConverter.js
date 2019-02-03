"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const usqOutRead_1 = require("./usqOutRead");
/*
export const readChemical: UsqOutConverter = async (maxId: string): Promise<{ lastId: string, data: any }> => {

    let iMaxId = maxId === "" ? 0 : Number(maxId);
    let sqlstring = `select top 1 chemID as ID, cas, Description, DescriptionC, molWeight, molFomula, mdlNumber
        from opdata.dbo.sc_chemical where reliability = 0 and chemID > '${iMaxId}' order by chemID`;
    return await read(sqlstring);
};
*/
const sqlReadChemical = `
select top 1 
    chemID as ID, cas, Description, DescriptionC, molWeight, molFomula, mdlNumber
    from opdata.dbo.sc_chemical 
    where reliability = 0 and chemID > @iMaxId order by chemID
`;
exports.readChemical = async (maxId) => {
    return await usqOutRead_1.usqOutRead(sqlReadChemical, maxId);
};
//# sourceMappingURL=chemicalConverter.js.map