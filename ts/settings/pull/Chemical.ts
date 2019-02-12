/*
import { Joint } from "../../uq-joint";
import { pullEntity } from ".";

export async function pullChemical(joint: Joint, queue: number): Promise<number> {

    let sqlstring = `select top 1 code as ID, countries, ChineseName from dbs.dbo.CountryCode1
        where code > '${queue}' and level = 1 order by code`;
    return await pullEntity(joint, 'Chemical', sqlstring, queue);
}
*/