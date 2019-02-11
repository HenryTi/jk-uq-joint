"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sqls = {
    //==============================================================
    //=========================== Chemical =========================
    //==============================================================
    readChemical: `
select top 1 
    chemID as ID, cas, Description, DescriptionC, molWeight, molFomula, mdlNumber
    from opdata.dbo.sc_chemical 
    where reliability = 0 and chemID > @iMaxId 
    order by chemID
`,
    //==============================================================
    //=========================== Common ===========================
    //==============================================================
    readPackTypeStandard: `
select top 1 a.ID, a.Unit, b.Name 
    from opdata.dbo.JNKStandardUnit a
        inner join opdata.dbo.JNKStandardUnitType b on a.UnitTypeId = b.ID 
    where a.ID > @iMaxId 
    order by a.ID`,
    readPackType: `
select top 1 a.ID, a.UnitE, a.UnitC, a.StandardUnitID 
    from opdata.dbo.SupplierPackingUnit a
    where a.ID > @iMaxId 
    order by a.ID`,
    readCurrency: `
select top 1 currency as ID 
    from zcl_mess.dbo.vw_currency_now 
    where currency > @iMaxId 
    order by currency`,
    readSalesRegion: `
select top 1 market_code as ID, Market_name, Currency 
    from zcl_mess.dbo.market 
    where market_code > @iMaxId
    order by market_code`,
    readLanguage: `
select top 1 LanguageID as ID, LanguageStr 
    from dbs.dbo.Languages 
    where LanguageId > @iMaxId 
    order by LanguageID`,
    readCountry: `
select top 1 code as ID, Countries, ChineseName 
    from dbs.dbo.CountryCode1 
    where code > @iMaxId and level = 1 
    order by code`,
    readProvince: `
select top 1 code as ID, Countries, ChineseName, parentCode 
    from dbs.dbo.CountryCode1 
    where code > @iMaxId and level = 2 
    order by code`,
    readCity: `
select top 1 code as ID, Countries, ChineseName, parentCode 
    from dbs.dbo.CountryCode1 
    where code > @iMaxId and level = 3
    order by code`,
    readCounty: `
select top 1 code as ID, Countries, ChineseName, parentCode 
    from dbs.dbo.CountryCode1 
    where code > @iMaxId and level = 4 
    order by code`,
};
//# sourceMappingURL=sqls.js.map