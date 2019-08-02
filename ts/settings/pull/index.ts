/*
import { pullTest } from "./pullTest";

const pull = {
    a: pullTest,
}

export default pull;
import { pullCountry, pullProvince, pullCity, pullCounty, pullPackTypeStandard, pullPackType, pullCurrency, pullSalesRegion } from "./common";
import { pullChemical } from "./Chemical";
import { Joint } from "../../uq-joint";
import { execSql } from "../../uq-joint/db/mysql/tool";

const pull = {

    Country: pullCountry,
    Province: pullProvince,
    City: pullCity,
    County: pullCounty,

    PackTypeStandard: pullPackTypeStandard,
    PackType: pullPackType,

    Currency: pullCurrency,
    SalesRegion: pullSalesRegion,

    Chemical: pullChemical,

}

export async function pullEntity(joint: Joint, entityName: string, sqlstring: string, queue: number): Promise<number> {

    let data = await execSql(sqlstring);
    await joint.uqIn(entityName, data);
    return queue + 1;
}

export default pull;
*/