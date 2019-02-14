
export const sqls = {
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


//==============================================================
//=========================== chemical ===========================
//==============================================================
readChemical: `
select top 1
    chemID as ID, cas, Description, DescriptionC, molWeight, molFomula, mdlNumber
    from opdata.dbo.sc_chemical
    where reliability = 0 and chemID > @iMaxId order by chemID
`,

//==============================================================
//=========================== customer ===========================
//==============================================================
readCustomer: `
select top 1 CID as ID, UnitID as OrganizationID, Name, FirstName, LastName, Sex as Gender
        , convert(nvarchar(30), BirthDate, 121) as BirthDate
        , Tel1, Tel2, Mobile, Email, Email2, Fax1, Fax2, Zip, SaleComanyID as SalesCompanyID, saleRegionBelongsTo as SalesRegionBelongsTo
        , convert(nvarchar(30), creaDate, 121) as CreateTime
        from dbs.dbo.Customers where CID > @iMaxId order by CID`,

readOrganization: `
select top 1 UnitID as ID, unitName as Name, convert(nvarchar(30), creaDate, 121) as CreateTime
        from dbs.dbo.CustUnits where UnitID > @iMaxId order by UnitID`,

readCustomerConsigneeContact: `
select top 1 ID, CID as CustomerID, userName as Name, userUnit as OrganizationName, isnull(userMobile, '') as Mobile
        , email as Email, userZipCode as Zip, userAdd as Addr, isDefault
        from dbs.dbo.net_OrderBase_txt where ID > @iMaxId order by ID`,

readCustomerInvoiceContact: `
select top 1 ID, CID as CustomerID, Name, Unit as OrganizationName, isnull(Mobile, '') as Mobile, Tel as Telephone
        , Email, Zip, Addr, isDefault
        from dbs.dbo.order_InvoiceInfo_txt where ID > @iMaxId order by ID`,


//==============================================================
//=========================== Product ===========================
//==============================================================
readBrand: `
select top 1 code as ID, Code as BrandID, name as BrandName from zcl_mess.dbo.manufactory where code > @iMaxId order by code`,

readBrandSalesRegion: `
select top 1 ExcID as ID, code as BrandID, market_code as SalesRegionID, yesorno as Level
        from zcl_mess.dbo.manufactoryMarket where ExcID > @iMaxId order by ExcID`,

readBrandDeliveryTime: `
select top 1 ID, BrandCode as BrandID, SaleRegionID as SalesRegionID, MinValue, MaxValue, Unit
        , case [Restrict] when 'NoRestrict' then 0 else 1 end as [Restrict]
        from zcl_mess.dbo.BrandDeliverTime where id > @iMaxId and isValid = 1 order by id`,

readProduct: `
select top 1 p.jkid as ID, p.jkid as ProductID, p.manufactory as BrandID, p.originalId as ProductNumber
        , isnull(p.Description, 'N/A') as Description, p.DescriptionC
        , pc.chemid as ChemicalID, zcl_mess.dbo.fc_recas(p.CAS) as CAS, p.MF as MolecularFomula, p.MW as molecularWeight, p.Purity
        from zcl_mess.dbo.products p inner join zcl_mess.dbo.productschem pc on pc.jkid = p.jkid
        where p.jkid > @iMaxId order by p.jkid`,

readPack: `
select top 1 jkcat as ID, jkcat as PackagingID, j.jkid as ProductID, j.PackNr, j.Quantity, j.Unit as Name
        from zcl_mess.dbo.jkcat j inner join zcl_mess.dbo.products p on j.jkid = p.jkid
        where j.jkcat > @iMaxId and j.unit in ( select unitE from opdata.dbo.supplierPackingUnit )
        order by j.jkcat`,

readPrice: `
select top 1 jp.ExCID as ID, jp.jkcat as PackingID, j.jkid as ProductID
        , jp.market_code as SalesRegionID, jp.Price, jp.Currency, jp.Expire_Date, JP.Discontinued
        from zcl_mess.dbo.jkcat_price jp inner join zcl_mess.dbo.jkcat j on jp.jkcat = j.jkcat
        where jp.ExCID > @iMaxId order by jp.ExCID`,

readProductSalesRegion: `
select top 1 ExCID as ID, jkid as ProductID, market_code as SalesRegionID, IsValid
        from zcl_mess.dbo.ProductsLocation where ExCID > @iMaxId order by ExCID`,

readProductLegallyProhibited: `
select top 1 jkid + market_code as ID, jkid as ProductID, market_code as SalesRegionID, left(description, 20) as Reason
        from zcl_mess.dbo.sc_safe_ProdCache where jkid + market_code > @iMaxId order by jkid + market_code`,

//==============================================================
//=========================== ProductCategory ===========================
//==============================================================
readProductCategory: `
select top 1 pc.ProductCategoryID as ID, pc.ParentProductCategoryID, pc.OrderWithinParentCatetory as OrderWithinParentCategory,
        pc.IsLeaf, pc.IsValid, pc.IsShow from opdata.dbo.ProductCategory pc
        where pc.ProductCategoryID > @iMaxId order by pc.ProductCategoryID`,

readProductCategoryLanguage: `
select top 1 ID, ProductCategoryID, LanguageID, ProductCategoryName
        from opdata.dbo.ProductCategoryLanguage where ID > @iMaxId order by ID`,

readProductProductCategory: `
select top 1 ID, SaleProductID, ProductCategoryID, IsValid
        from opdata.dbo.SaleProductProductCategory where ID > @iMaxId order by ID`,

//==============================================================
//=========================== Warehouse ===========================
//==============================================================
readWarehouse: `
select top 1 CompanyID as ID, companyName as WarehouseName, companyAddr
        from dbs.dbo.Scompany where CompanyID > @iMaxId order by CompanyId`,

readSalesRegionWarehouse: `
select top 1 ID, CompanyID as WarehouseID, Location as SalesRegionID, minDeliverTime, maxDeliverTime
        from dbs.dbo.CompanyLocation where ID > @iMaxId order by Id`,

//==============================================================
//=========================== Promotion ===========================
//==============================================================
readPromotion:
`select top 1 MarketingID as ID, Name
        , mType as Type, mstatus as Status, PStartTime as StartDate, PendTime as EndDate, market_code as SalesRegionID, inputtime as CreateTime
        from dbs.dbo.Marketing where MarketingID > @iMaxId order by MarketingID`,

readPromotionLanguage:
`select top 1 ExcID as ID, MarketingID as PromotionID, LanguageID, messageText as Description, Url
        from dbs.dbo.MarketingMessageLanguages where ExcID > @iMaxId order by ExcID`,

readPromotionPack:
`select top 1 ExcID as ID, MarketingID as PromotionID, jkid as ProductID, jkcat as PackageID, activeDiscount as Discount, isStock as WhenHasStorage
        from zcl_mess.dbo.ProductsMarketing where ExcID > @iMaxId order by ExcID`,
}
