import { pullTest } from "./pullTest";
import { pullCountry, pullProvince, pullCity, pullCounty, pullPackTypeStandard, pullPackType, pullCurrency, pullSalesRegion } from "./common";
import { pullChemical } from "./Chemical";
import { Joint } from "../../usq-joint";
import { execSql } from "../../usq-joint/db/mysql/tool";

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

    a: pullTest,
}

export async function pullEntity(joint: Joint, entityName: string, sqlstring: string, queue: number): Promise<number> {

    let data = await execSql(sqlstring);
    await joint.pushToUsq(entityName, data);
    return queue + 1;
}

export default pull;
