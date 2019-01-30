/*
import { Joint } from "../../usq-joint";
import { pullEntity } from ".";

export async function pullBrand(joint: Joint, queue: number): Promise<number> {

    let sqlstring = `select top 1 code as ID, countries, ChineseName from dbs.dbo.CountryCode1
        where code > '${queue}' and level = 1 order by code`;
    return await pullEntity(joint, 'Brand', sqlstring, queue);
}

export async function pullBrandSalesRegion(joint: Joint, queue: number): Promise<number> {

    let sqlstring = `select top 1 code as ID, countries, ChineseName from dbs.dbo.CountryCode1
        where code > '${queue}' and level = 1 order by code`;
    return await pullEntity(joint, 'BrandSalesRegion', sqlstring, queue);
}

export async function pullBrandDeliveryTime(joint: Joint, queue: number): Promise<number> {

    let sqlstring = `select top 1 code as ID, countries, ChineseName from dbs.dbo.CountryCode1
        where code > '${queue}' and level = 1 order by code`;
    return await pullEntity(joint, 'BrandDeliveryTime', sqlstring, queue);
}

export async function pullArticle(joint: Joint, queue: number): Promise<number> {

    let sqlstring = `select top 1 code as ID, countries, ChineseName from dbs.dbo.CountryCode1
        where code > '${queue}' and level = 1 order by code`;
    return await pullEntity(joint, 'Article', sqlstring, queue);
}

export async function pullArticleSalesRegion(joint: Joint, queue: number): Promise<number> {

    let sqlstring = `select top 1 code as ID, countries, ChineseName from dbs.dbo.CountryCode1
        where code > '${queue}' and level = 1 order by code`;
    return await pullEntity(joint, 'ArticleSalesRegion', sqlstring, queue);
}

export async function pullArticleLegallyProhibited(joint: Joint, queue: number): Promise<number> {

    let sqlstring = `select top 1 code as ID, countries, ChineseName from dbs.dbo.CountryCode1
        where code > '${queue}' and level = 1 order by code`;
    return await pullEntity(joint, 'ArticleLegallyProhibited', sqlstring, queue);
}

export async function pullProduct2(joint: Joint, queue: number): Promise<number> {

    let sqlstring = `select top 1 code as ID, countries, ChineseName from dbs.dbo.CountryCode1
        where code > '${queue}' and level = 1 order by code`;
    return await pullEntity(joint, 'Product2', sqlstring, queue);
}

export async function pullPrice2(joint: Joint, queue: number): Promise<number> {

    let sqlstring = `select top 1 code as ID, countries, ChineseName from dbs.dbo.CountryCode1
        where code > '${queue}' and level = 1 order by code`;
    return await pullEntity(joint, 'Price2', sqlstring, queue);
}
*/ 
//# sourceMappingURL=product.js.map