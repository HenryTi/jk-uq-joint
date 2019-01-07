import { UsqOutConverter } from "../pulls";
import { read } from ".";

export const readBrand: UsqOutConverter = async (maxId: string): Promise<{ lastId: string, data: any }> => {

    let sqlstring = `select top 1 code as ID, name as BrandName from zcl_mess.dbo.manufactory where code > '${maxId}' order by code`;
    return await read(sqlstring);
};

export const readBrandSalesRegion: UsqOutConverter = async (maxId: string): Promise<{ lastId: string, data: any }> => {

    let sqlstring = `select top 1 ExcID as ID, code as BrandID, market_code as SalesRegionID, yesorno as Level
        from zcl_mess.dbo.manufactoryMarket where ExcID > '${maxId}' order by ExcID`;
    return await read(sqlstring);
};

export const readBrandDeliveryTime: UsqOutConverter = async (maxId: string): Promise<{ lastId: string, data: any }> => {

    let iMaxId = maxId === "" ? 0 : Number(maxId);
    let sqlstring = `select top 1 ID, BrandCode as BrandID, SaleRegionID as SalesRegionID, MinValue, MaxValue, Unit
        , case [Restrict] when 'NoRestrict' then 0 else 1 end as [Restrict]
        from zcl_mess.dbo.BrandDeliverTime where id > '${maxId}' and isValid = 1 order by id`;
    return await read(sqlstring);
};

export const readProduct: UsqOutConverter = async (maxId: string): Promise<{ lastId: string, data: any }> => {

    let sqlstring = `select top 1 p.jkid as ID, p.manufactory as BrandID, p.originalId as ProductNumber
        , isnull(p.Description, 'N/A') as Description, p.DescriptionC
        , pc.chemid as ChemicalID, zcl_mess.dbo.fc_recas(p.CAS) as CAS, p.MF as MolecularFomula, p.MW as molecularWeight, p.Purity
        from zcl_mess.dbo.products p inner join zcl_mess.dbo.productschem pc on pc.jkid = p.jkid
        where p.jkid > '${maxId}' order by p.jkid`;
    return await read(sqlstring);
};

export const readPack: UsqOutConverter = async (maxId: string): Promise<{ lastId: string, data: any }> => {

    let sqlstring = `select top 1 jkcat as ID, j.jkid as ProductID, j.PackNr, j.Quantity, j.Unit as Name
        from zcl_mess.dbo.jkcat j inner join zcl_mess.dbo.products p on j.jkid = p.jkid
        where j.jkcat > '${maxId}' and j.unit in ( select unitE from opdata.dbo.supplierPackingUnit )
        order by j.jkcat`;
    return await read(sqlstring);
};

export const readPrice: UsqOutConverter = async (maxId: string): Promise<{ lastId: string, data: any }> => {

    let sqlstring = `select top 1 jp.ExCID as ID, jp.jkcat as PackingID, j.jkid as ProductID
        , jp.market_code as SalesRegionID, jp.Price, jp.Currency, jp.Expire_Date, JP.Discontinued
        from zcl_mess.dbo.jkcat_price jp inner join zcl_mess.dbo.jkcat j on jp.jkcat = j.jkcat
        where jp.ExCID > '${maxId}' order by jp.ExCID`;
    return await read(sqlstring);
};

export const readProductSalesRegion: UsqOutConverter = async (maxId: string): Promise<{ lastId: string, data: any }> => {

    let sqlstring = `select top 1 ExCID as ID, jkid as ProductID, market_code as SalesRegionID, IsValid
        from zcl_mess.dbo.ProductsLocation where ExCID > '${maxId}' order by ExCID`;
    return await read(sqlstring);
};

export const readProductLegallyProhibited: UsqOutConverter = async (maxId: string): Promise<{ lastId: string, data: any }> => {

    let sqlstring = `select top 1 jkid + market_code as ID, jkid as ProductID, market_code as SalesRegionID, left(description, 20) as Reason
        from zcl_mess.dbo.sc_safe_ProdCache where jkid + market_code > '${maxId}' order by jkid + market_code`;
    return await read(sqlstring);
};