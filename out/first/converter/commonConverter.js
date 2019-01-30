"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
exports.readPackTypeStandard = async (maxId) => {
    let iMaxId = maxId === "" ? 0 : Number(maxId);
    let sqlstring = `select top 1 a.ID, a.Unit, b.Name from opdata.dbo.JNKStandardUnit a
        inner join opdata.dbo.JNKStandardUnitType b on a.UnitTypeId = b.ID where a.ID > '${iMaxId}' order by a.ID`;
    return await _1.read(sqlstring);
};
exports.readPackType = async (maxId) => {
    let iMaxId = maxId === "" ? 0 : Number(maxId);
    let sqlstring = `select top 1 a.ID, a.UnitE, a.UnitC, a.StandardUnitID from opdata.dbo.SupplierPackingUnit a
        where a.ID > '${iMaxId}' order by a.ID`;
    return await _1.read(sqlstring);
};
exports.readCurrency = async (maxId) => {
    let sqlstring = `select top 1 currency as ID from zcl_mess.dbo.vw_currency_now where currency > '${maxId}' order by currency`;
    return await _1.read(sqlstring);
};
exports.readSalesRegion = async (maxId) => {
    let sqlstring = `select top 1 market_code as ID, Market_name, Currency from zcl_mess.dbo.market where market_code > '${maxId}' order by market_code`;
    return await _1.read(sqlstring);
};
exports.readLanguage = async (maxId) => {
    let sqlstring = `select top 1 LanguageID as ID, LanguageStr from dbs.dbo.Languages where LanguageId > '${maxId}' order by LanguageID`;
    return await _1.read(sqlstring);
};
exports.readCountry = async (maxId) => {
    let sqlstring = `select top 1 code as ID, Countries, ChineseName from dbs.dbo.CountryCode1 where code > '${maxId}' and level = 1 order by code`;
    return await _1.read(sqlstring);
};
exports.readProvince = async (maxId) => {
    let sqlstring = `select top 1 code as ID, Countries, ChineseName, parentCode from dbs.dbo.CountryCode1 where code > '${maxId}' and level = 2 order by code`;
    return await _1.read(sqlstring);
};
exports.readCity = async (maxId) => {
    let sqlstring = `select top 1 code as ID, Countries, ChineseName, parentCode from dbs.dbo.CountryCode1 where code > '${maxId}' and level = 3 order by code`;
    return await _1.read(sqlstring);
};
exports.readCounty = async (maxId) => {
    let sqlstring = `select top 1 code as ID, Countries, ChineseName, parentCode from dbs.dbo.CountryCode1 where code > '${maxId}' and level = 4 order by code`;
    return await _1.read(sqlstring);
};
//# sourceMappingURL=commonConverter.js.map