import config from 'config';

const idBrokened = config.get<any>("idBrokened");
const promiseSize = config.get<number>("promiseSize");

export const sqls = {
        //==============================================================
        //=========================== Common ===========================
        //==============================================================
        readPackTypeStandard: `
                select top ${promiseSize} a.ID, a.Unit, b.Name
                from opdata.dbo.JNKStandardUnit a
                        inner join opdata.dbo.JNKStandardUnitType b on a.UnitTypeId = b.ID
                where a.ID > @iMaxId
                order by a.ID`,

        readPackType: `
                select top ${promiseSize} a.ID, a.UnitE, a.UnitC, a.StandardUnitID
                from opdata.dbo.SupplierPackingUnit a
                where a.ID > @iMaxId
                order by a.ID`,

        readCurrency: `
                select top ${promiseSize} currency as ID
                from zcl_mess.dbo.vw_currency_now
                where currency > @iMaxId
                order by currency`,

        readSalesRegion: `
                select top ${promiseSize} market_code as ID, Market_name, Currency
                from zcl_mess.dbo.market
                where market_code > @iMaxId
                order by market_code`,

        readLanguage: `
                select top ${promiseSize} LanguageID as ID, LanguageStr
                from dbs.dbo.Languages
                where LanguageId > @iMaxId
                order by LanguageID`,

        readCountry: `
                select top ${promiseSize} code as ID, Countries, ChineseName
                from dbs.dbo.CountryCode1
                where code > @iMaxId and level = 1
                order by code`,

        readProvince: `
                select top ${promiseSize} code as ID, Countries, ChineseName, parentCode
                from dbs.dbo.CountryCode1
                where code > @iMaxId and level = 2
                order by code`,

        readCity: `
                select top ${promiseSize} code as ID, Countries, ChineseName, parentCode
                from dbs.dbo.CountryCode1
                where code > @iMaxId and level = 3
                order by code`,

        readCounty: `
                select top ${promiseSize} code as ID, Countries, ChineseName, parentCode
                from dbs.dbo.CountryCode1
                where code > @iMaxId and level = 4
                order by code`,

        readInvoiceType: `
                select top ${promiseSize} ID, description
                from (
                    select 1 as ID, '普通发票' as Description
                    union
                    select 2 as ID, '增值税发票' as Description
                ) t where ID > @iMaxId
                order by ID`,

        //==============================================================
        //=========================== chemical ===========================
        //==============================================================
        readEmployee: `
                select top ${promiseSize} epid as ID, ChineseName, EpName1, EpName2, Title, Status, Creadate as CreateTime
                from dbs.dbo.Employee where epid > @iMaxId and ChineseName is not null order by epid`,

        //==============================================================
        //=========================== chemical ===========================
        //==============================================================
        readChemical: `
                select top ${promiseSize}
                chemID as ID, cas, Description, DescriptionC, molWeight, molFomula, mdlNumber
                from opdata.dbo.sc_chemical
                where reliability = 0 and chemID > @iMaxId and chemID > ${idBrokened.chemid} order by chemID
                        `,

        //==============================================================
        //=========================== customer ===========================
        //==============================================================
        readCustomer: `
                select top ${promiseSize} CID as ID, CID as CustomerID, UnitID as OrganizationID, Name, FirstName, LastName, XYZ, Sex as Gender
                        , convert(nvarchar(30), BirthDate, 121) as BirthDate
                        , Tel1, Tel2, Mobile, Email, Email2, Fax1, Fax2, Zip
                        , BuyersAcName as InvoiceTitle, BuyersTaxNo as TaxNo, CompanyRegisteredAddress as RegisteredAddress
                        , CompanyTelephone as RegisteredTelephone, BankName, BankAccountNumber
                        , EPR as SalesmanID, CustomerServiceEPR as CustomerServiceStuffID
                        , case C5 when 'xx' then 0 else 1 end as IsValid
                        , SaleComanyID as SalesCompanyID
                        , saleRegionBelongsTo as SalesRegionBelongsTo
                        , convert(nvarchar(30), creaDate, 121) as CreateTime
                from dbs.dbo.Customers where CID > @iMaxId and CID > '${idBrokened.CID}' order by CID`,

        readOrganization: `
                select top ${promiseSize} UnitID as ID, UnitID as OrganizationID, unitName as Name, convert(nvarchar(30), creaDate, 121) as CreateTime
                from dbs.dbo.CustUnits where UnitID > @iMaxId order by UnitID`,

        //==============================================================
        //=========================== Product ===========================
        //==============================================================
        readBrand: `
                select top ${promiseSize} code as ID, Code as BrandID, name as BrandName from zcl_mess.dbo.manufactory where code > @iMaxId order by code`,

        readProduct: `
                select top ${promiseSize} p.jkid as ID, p.jkid as ProductID, p.manufactory as BrandID, p.originalId as ProductNumber
                        , isnull(p.Description, 'N/A') as Description, p.DescriptionC
                        , pc.chemid as ChemicalID, zcl_mess.dbo.fc_recas(p.CAS) as CAS, p.MF as MolecularFomula, p.MW as MolecularWeight, p.Purity
                        , p.[Restrict], p.LotNumber as MdlNumber, case when(select count(pv.jkid) from zcl_mess.dbo.Invalid_Products pv where pv.jkid = p.jkid) > 0 then 0 else 1 end as IsValid
                from zcl_mess.dbo.products p inner join zcl_mess.dbo.productschem pc on pc.jkid = p.jkid
                left join zcl_mess.dbo.Invalid_products pv on pv.jkid = p.jkid
                where p.jkid > @iMaxId and p.jkid > '${idBrokened.jkid}' order by p.jkid`,

        //==============================================================
        //=========================== ProductCategory ===========================
        //==============================================================
        readProductCategory: `
                select top ${promiseSize} pc.ProductCategoryID as ID, pc.ProductCategoryID, pc.ParentProductCategoryID, pc.OrderWithinParentCatetory as OrderWithinParentCategory,
                        pc.IsLeaf, pc.IsValid, pc.IsShow from opdata.dbo.ProductCategory pc
                where pc.ProductCategoryID > @iMaxId order by pc.ProductCategoryID`,

        readProductCategoryLanguage: `
                select top ${promiseSize} ID, ID as ProductCategoryLanguageID, ProductCategoryID, LanguageID, ProductCategoryName
                from opdata.dbo.ProductCategoryLanguage where ID > @iMaxId order by ID`,

        readProductProductCategory: `
                select top ${promiseSize} ID, ID as SaleProductProductCategoryID, SaleProductID, ProductCategoryID, IsValid
                from opdata.dbo.SaleProductProductCategory where ID > @iMaxId and ID > ${idBrokened.PPCID} order by ID`,

        //==============================================================
        //=========================== Warehouse ===========================
        //==============================================================
        readWarehouse: `
                select top ${promiseSize} CompanyID as ID, CompanyID as WarehouseID, companyName as WarehouseName, companyAddr
                from dbs.dbo.Scompany where CompanyID > @iMaxId order by CompanyId`,

        readSalesRegionWarehouse: `
                select top ${promiseSize} ID, CompanyID as WarehouseID, Location as SalesRegionID, minDeliverTime, maxDeliverTime
                from dbs.dbo.CompanyLocation where ID > @iMaxId order by Id`,

        //==============================================================
        //=========================== Promotion ===========================
        //==============================================================
        readPromotionType:
                `select top ${promiseSize} MType as ID, MType as MarketingTypeID, MTypeName as Description
                from dbs.dbo.MarketingType where MType > @iMaxId order by MType`,

        readPromotionStatus:
                `select top ${promiseSize} MStatus as ID, MStatus as MarketingStatusID, MStatusName as Description
                from dbs.dbo.MarketingStatus where MStatus > @iMaxId order by MStatus`,

        readPromotion:
                `select top ${promiseSize} MarketingID as ID, MarketingID, Name
                        , mType as Type, mstatus as Status, PStartTime as StartDate, PendTime as EndDate, market_code as SalesRegionID, inputtime as CreateTime
                from dbs.dbo.Marketing where MarketingID > @iMaxId and PStartTime is not null and isnull(PEndTime, '2029-12-01') > getdate() order by MarketingID`,

        //==============================================================
        //=========================== Agreement ===========================
        //==============================================================
        readAgreement:
                `select top ${promiseSize} AgreementId as ID, AgreementID, ObjType
                from dbs.dbo.Agreement where AgreementID > @iMaxId and objType in ('C', 'U')  order by AgreementId`,
}