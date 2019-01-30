/*
import { Joint } from "../../usq-joint";
import { pullEntity } from ".";

export async function pullCountry(joint: Joint, queue: number): Promise<number> {

    let sqlstring = `select top 1 code as ID, countries, ChineseName from dbs.dbo.Export_Country
        where id > '${queue}' order by id`;
    return await pullEntity(joint, 'Country', sqlstring, queue);
}

export async function pullProvince(joint: Joint, queue: number): Promise<number> {

    let sqlstring = `select top 1 code as ID, countries, ChineseName from dbs.dbo.CountryCode1
        where code > '${queue}' and level = 1 order by code`;
    return await pullEntity(joint, 'Province', sqlstring, queue);
}

export async function pullCity(joint: Joint, queue: number): Promise<number> {

    let sqlstring = `select top 1 code as ID, countries, ChineseName from dbs.dbo.CountryCode1
        where code > '${queue}' and level = 1 order by code`;
    return await pullEntity(joint, 'City', sqlstring, queue);
}

export async function pullCounty(joint: Joint, queue: number): Promise<number> {

    let sqlstring = `select top 1 code as ID, countries, ChineseName from dbs.dbo.CountryCode1
        where code > '${queue}' and level = 1 order by code`;
    return await pullEntity(joint, 'County', sqlstring, queue);
}

export async function pullPackTypeStandard(joint: Joint, queue: number): Promise<number> {

    let sqlstring = `select top 1 code as ID, countries, ChineseName from dbs.dbo.CountryCode1
        where code > '${queue}' and level = 1 order by code`;
    return await pullEntity(joint, 'PackTypeStandard', sqlstring, queue);
}

export async function pullPackType(joint: Joint, queue: number): Promise<number> {

    let sqlstring = `select top 1 code as ID, countries, ChineseName from dbs.dbo.CountryCode1
        where code > '${queue}' and level = 1 order by code`;
    return await pullEntity(joint, 'PackType', sqlstring, queue);
}

export async function pullCurrency(joint: Joint, queue: number): Promise<number> {

    let sqlstring = `select top 1 code as ID, countries, ChineseName from dbs.dbo.CountryCode1
        where code > '${queue}' and level = 1 order by code`;
    return await pullEntity(joint, 'Currency', sqlstring, queue);
}

export async function pullSalesRegion(joint: Joint, queue: number): Promise<number> {

    let sqlstring = `select top 1 code as ID, countries, ChineseName from dbs.dbo.CountryCode1
        where code > '${queue}' and level = 1 order by code`;
    return await pullEntity(joint, 'SalesRegion', sqlstring, queue);
}
*/ 
//# sourceMappingURL=common.js.map