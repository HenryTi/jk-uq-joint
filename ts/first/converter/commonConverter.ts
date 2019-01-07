import { UsqOutConverter } from "../pulls";
import { read } from ".";

export const readPackTypeStandard: UsqOutConverter = async (maxId: string): Promise<{ lastId: string, data: any }> => {

    let iMaxId = maxId === "" ? 0 : Number(maxId);
    let sqlstring = `select top 1 a.ID, a.unit, b.name from opdata.dbo.JNKStandardUnit a
        inner join opdata.dbo.JNKStandardUnitType b on a.UnitTypeId = b.ID where a.ID > '${iMaxId}' order by a.ID`;
    return await read(sqlstring);
};

export const readPackType: UsqOutConverter = async (maxId: string): Promise<{ lastId: string, data: any }> => {

    let iMaxId = maxId === "" ? 0 : Number(maxId);
    let sqlstring = `select top 1 a.ID, a.unitE, a.unitC, a.standardUnitID from opdata.dbo.SupplierPackingUnit a
        where a.ID > '${iMaxId}' order by a.ID`;
    return await read(sqlstring);
};

export const readCurrency: UsqOutConverter = async (maxId: string): Promise<{ lastId: string, data: any }> => {

    let sqlstring = `select top 1 currency as ID from zcl_mess.dbo.vw_currency_now where currency > '${maxId}' order by currency`;
    return await read(sqlstring);
};

export const readSalesRegion: UsqOutConverter = async (maxId: string): Promise<{ lastId: string, data: any }> => {

    let sqlstring = `select top 1 market_code as ID, market_name, currency from zcl_mess.dbo.market where market_code > '${maxId}' order by market_code`;
    return await read(sqlstring);
};

export const readLanguage: UsqOutConverter = async (maxId: string): Promise<{ lastId: string, data: any }> => {

    let sqlstring = `select top 1 LanguageID as ID, LanguageStr from dbs.dbo.Languages where LanguageId > '${maxId}' order by LanguageID`;
    return await read(sqlstring);
};

export const readCountry: UsqOutConverter = async (maxId: string): Promise<{ lastId: string, data: any }> => {

    let sqlstring = `select top 1 code as ID, countries, ChineseName from dbs.dbo.CountryCode1 where code > '${maxId}' and level = 1 order by code`;
    return await read(sqlstring);
};

export const readProvince: UsqOutConverter = async (maxId: string): Promise<{ lastId: string, data: any }> => {

    let sqlstring = `select top 1 code as ID, countries, ChineseName, parentCode from dbs.dbo.CountryCode1 where code > '${maxId}' and level = 2 order by code`;
    return await read(sqlstring);
};

export const readCity: UsqOutConverter = async (maxId: string): Promise<{ lastId: string, data: any }> => {

    let sqlstring = `select top 1 code as ID, countries, ChineseName, parentCode from dbs.dbo.CountryCode1 where code > '${maxId}' and level = 3 order by code`;
    return await read(sqlstring);
};

export const readCounty: UsqOutConverter = async (maxId: string): Promise<{ lastId: string, data: any }> => {

    let sqlstring = `select top 1 code as ID, countries, ChineseName, parentCode from dbs.dbo.CountryCode1 where code > '${maxId}' and level = 4 order by code`;
    return await read(sqlstring);
};