import { UsqOutConverter } from "../pulls";
import { usqOutRead } from "./usqOutRead";

/*
export const readChemical: UsqOutConverter = async (maxId: string): Promise<{ lastId: string, data: any }> => {

    let iMaxId = maxId === "" ? 0 : Number(maxId);
    let sqlstring = `select top 1 chemID as ID, cas, Description, DescriptionC, molWeight, molFomula, mdlNumber
        from opdata.dbo.sc_chemical where reliability = 0 and chemID > '${iMaxId}' order by chemID`;
    return await read(sqlstring);
};
*/
/*
export const readChemical = `
select top 1 
    chemID as ID, cas, Description, DescriptionC, molWeight, molFomula, mdlNumber
    from opdata.dbo.sc_chemical 
    where reliability = 0 and chemID > @iMaxId order by chemID
`;
*/
