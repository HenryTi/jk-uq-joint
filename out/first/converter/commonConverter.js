/*
import { UqOutConverter } from "../pulls";
import { read } from './uqOutRead'

export const readPackTypeStandard: UqOutConverter = async (maxId: string): Promise<{ lastId: string, data: any }> => {

    let iMaxId = maxId === "" ? 0 : Number(maxId);
    let sqlstring = `select top 1 a.ID, a.Unit, b.Name from opdata.dbo.JNKStandardUnit a
        inner join opdata.dbo.JNKStandardUnitType b on a.UnitTypeId = b.ID where a.ID > '${iMaxId}' order by a.ID`;
    return await read(sqlstring);
};

export const readPackType: UqOutConverter = async (maxId: string): Promise<{ lastId: string, data: any }> => {

    let iMaxId = maxId === "" ? 0 : Number(maxId);
    let sqlstring = `select top 1 a.ID, a.UnitE, a.UnitC, a.StandardUnitID from opdata.dbo.SupplierPackingUnit a
        where a.ID > '${iMaxId}' order by a.ID`;
    return await read(sqlstring);
};

export const readCurrency: UqOutConverter = async (maxId: string): Promise<{ lastId: string, data: any }> => {

    let sqlstring = `select top 1 currency as ID from zcl_mess.dbo.vw_currency_now where currency > '${maxId}' order by currency`;
    return await read(sqlstring);
};

export const readSalesRegion: UqOutConverter = async (maxId: string): Promise<{ lastId: string, data: any }> => {

    let sqlstring = `select top 1 market_code as ID, Market_name, Currency from zcl_mess.dbo.market where market_code > '${maxId}' order by market_code`;
    return await read(sqlstring);
};

export const readLanguage: UqOutConverter = async (maxId: string): Promise<{ lastId: string, data: any }> => {

    let sqlstring = `select top 1 LanguageID as ID, LanguageStr from dbs.dbo.Languages where LanguageId > '${maxId}' order by LanguageID`;
    return await read(sqlstring);
};

export const readCountry: UqOutConverter = async (maxId: string): Promise<{ lastId: string, data: any }> => {

    let sqlstring = `select top 1 code as ID, Countries, ChineseName from dbs.dbo.CountryCode1 where code > '${maxId}' and level = 1 order by code`;
    return await read(sqlstring);
};

export const readProvince: UqOutConverter = async (maxId: string): Promise<{ lastId: string, data: any }> => {

    let sqlstring = `select top 1 code as ID, Countries, ChineseName, parentCode from dbs.dbo.CountryCode1 where code > '${maxId}' and level = 2 order by code`;
    return await read(sqlstring);
};

export const readCity: UqOutConverter = async (maxId: string): Promise<{ lastId: string, data: any }> => {

    let sqlstring = `select top 1 code as ID, Countries, ChineseName, parentCode from dbs.dbo.CountryCode1 where code > '${maxId}' and level = 3 order by code`;
    return await read(sqlstring);
};

export const readCounty: UqOutConverter = async (maxId: string): Promise<{ lastId: string, data: any }> => {

    let sqlstring = `select top 1 code as ID, Countries, ChineseName, parentCode from dbs.dbo.CountryCode1 where code > '${maxId}' and level = 4 order by code`;
    return await read(sqlstring);
};
*/
//# sourceMappingURL=commonConverter.js.map