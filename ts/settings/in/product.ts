import { UqInTuid, UqInMap, UqInTuidArr, UqIn, Joint } from "../../uq-joint";
import { uqs } from "../uqs";
import { productPullWrite, productFirstPullWrite, packFirstPullWrite, pushRecordset } from "../../first/converter/productPullWrite";
import { execSql } from "../../mssql/tools";

export const Brand: UqInTuid = {
    uq: uqs.jkProduct,
    type: 'tuid',
    entity: 'Brand',
    key: 'BrandID',
    mapper: {
        $id: 'BrandID@Brand',
        no: "BrandID",
        name: "BrandName",
    },
    pull: `select top 1 ID, BrandID, BrandName
        from ProdData.dbo.Export_Brand where ID > @iMaxId order by ID`,
    firstPullWrite: async (joint: Joint, data: any): Promise<boolean> => {
        try {
            joint.uqIn(Brand, data);
            let brandId = data['BrandID'];
            let promisesSql: PromiseLike<any>[] = [];
            let brandSalesRegionSql = `
                select top 1 ExcID as ID, code as BrandID, market_code as SalesRegionID, yesorno as Level
                        from zcl_mess.dbo.manufactoryMarket where code = @BrandID`;
            promisesSql.push(execSql(brandSalesRegionSql, [{ 'name': 'BrandID', 'value': brandId }]));

            let readBrandDeliveryTime = `
                select ID, BrandCode as BrandID, SaleRegionID as SalesRegionID, MinValue, MaxValue, Unit
                        , case [Restrict] when 'NoRestrict' then 0 else 1 end as [Restrict]
                        from zcl_mess.dbo.BrandDeliverTime where BrandCode = @BrandID and isValid = 1`;
            promisesSql.push(execSql(readBrandDeliveryTime, [{ 'name': 'BrandID', 'value': brandId }]));

            let sqlResult = await Promise.all(promisesSql);
            let promises: PromiseLike<any>[] = [];
            promises.push(pushRecordset(joint, sqlResult[0], BrandSalesRegion));
            promises.push(pushRecordset(joint, sqlResult[1], BrandDeliveryTime));
            await Promise.all(promises);
            return true;
        } catch (error) {

        }
    }
};

export const BrandSalesRegion: UqInMap = {
    uq: uqs.jkProduct,
    type: 'map',
    entity: 'BrandSalesRegion',
    mapper: {
        brand: "BrandID@Brand",
        arr1: {
            salesRegion: "^SalesRegionID@SalesRegion",
            level: "^Level",
        }
    },
    pull: `select top 1 ID, BrandID, SalesRegionID, BrandLevel as Level
        from ProdData.dbo.Export_BrandSalesRegion where ID > @iMaxId order by ID`,
};

export const BrandDeliveryTime: UqInMap = {
    uq: uqs.jkProduct,
    type: 'map',
    entity: 'BrandDeliveryTime',
    mapper: {
        brand: "BrandID@Brand",
        arr1: {
            salesRegion: "^SalesRegionID@SalesRegion",
            minValue: "^MinValue",
            maxValue: "^MaxValue",
            unit: '^Unit',
            // deliveryTimeDescription: "^DeliveryTimeDescription",
            isRestrict: '^Restrict',
        }
    },
    pull: `select top 1 ID, BrandCode as BrandID, SaleRegionID as SalesRegionID, MinValue, MaxValue, Unit
        , case [Restrict] when 'NoRestrict' then 0 else 1 end as [Restrict]
        from ProdData.dbo.Export_BrandDeliverTime where id > @iMaxId and isValid = 1 order by id`,
};

/*
export const Product: UqInTuid = {
    uq: uqs.jkProduct,
    type: 'tuid',
    entity: 'Product',
    key: 'ProductID',
    mapper: {
        $id: 'ProductID@Product',
        no: "ProductID",
        brand: "BrandID@Brand",
        origin: "ProductNumber",
        description: 'Description',
        descriptionC: 'DescriptionC',
    }
};
*/

export const ProductX: UqInTuid = {
    uq: uqs.jkProduct,
    type: 'tuid',
    entity: 'ProductX',
    key: 'ProductID',
    mapper: {
        $id: 'ProductID@ProductX',
        no: 'ProductID',
        brand: 'BrandID@Brand',
        origin: 'ProductNumber',
        description: 'Description',
        descriptionC: 'DescriptionC',
        isValid: 'IsValid',
    },
    pull: `select top 1 ID, ProductID, BrandID, ProductNumber, Description, DescriptionC, CasNumber as CAS, ChemicalID
        , MolecularFormula, MolecularWeight, Purity, Grade, MdlNumber, [Restrict], 1 as IsValid
        from ProdData.dbo.Export_Product where ID > @iMaxId order by ID`,
    pullWrite: productPullWrite,
    firstPullWrite: productFirstPullWrite,
};

export const InvalidProduct: UqInTuid = {
    uq: uqs.jkProduct,
    type: 'tuid',
    entity: 'InvalidProduct',
    key: 'ProductID',
    mapper: {

    },
    pull: `select top 1 pv.ID, pv.ProductID, p.manufactory as BrandID, p.originalId as ProductNumber, p.Description, p.DescriptionC
        , zcl_mess.dbo.fc_recas(p.CAS) as CAS, pc.ChemID as ChemicalID
        , p.mf as MolecularFormula, p.mw as MolecularWeight, p.Purity, p.LotNumber as MdlNumber, p.[Restrict], 0 as IsValid
        from ProdData.dbo.Export_Invalid_Product pv inner join zcl_mess.dbo.Product p on pv.ProductID = p.jkid
        inner join zcl_mess.dbo.ProductChem pc on pc.jkid = p.jkid
        where pv.ID > @iMaxId order by pv.ID`,
    pullWrite: productPullWrite,
};

export const ProductPackX: UqInTuidArr = {
    uq: uqs.jkProduct,
    type: 'tuid-arr',
    entity: 'ProductX_PackX',
    key: "PackingID",
    owner: "ProductID",
    mapper: {
        //owner: "ProductID",
        $id: "PackingID@ProductX_PackX",
        jkcat: 'PackingID',
        radiox: "PackNr",
        radioy: "Quantity",
        unit: "Name",
    },
    pull: `select top 1 ID, PackagingID as PackingID, ProductID, PackagingQuantity as PackNr, PackagingVolumn as Quantity, PackagingUnit as Name
        from ProdData.dbo.Export_Packaging where ID > @iMaxId order by ID`,
    firstPullWrite: packFirstPullWrite,
};

export const PriceX: UqInMap = {
    uq: uqs.jkProduct,
    type: 'map',
    entity: 'PriceX',
    mapper: {
        product: "ProductID@ProductX",
        pack: "PackingID@ProductX_PackX",
        arr1: {
            salesRegion: "^SalesRegionID@SalesRegion",
            expireDate: "^Expire_Date",
            discountinued: "^Discontinued",
            retail: "^Price",
        }
    },
    pull: `select top 1 jp.ID, jp.PackagingID as PackingID, j.jkid as ProductID, jp.SalesRegionID, j.Price
        , j.Currency, j.ExpireDate as Expire_Date, j.Discontinued
        from ProdData.dbo.Export_PackagingSalesRegion jp inner join zcl_mess.dbo.jkcat j on jp.PackagingID = j.jkcat
        where jp.ID > @iMaxId order by jp.ID`,
    pullWrite: async (joint: Joint, data: any) => {
        try {
            data["Expire_Date"] = data["Expire_Date"].getTime();
            await joint.uqIn(PriceX, data);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
};

export const ProductChemical: UqInMap = {
    uq: uqs.jkProduct,
    type: 'map',
    entity: 'ProductChemical',
    mapper: {
        product: "ID@ProductX",
        arr1: {
            chemical: "^ChemicalID@Chemical",
            CAS: "^CAS",
            purity: "^Purity",
            molecularFomula: "^MolecularFomula",
            molecularWeight: "^MolecularWeight",
        }
    }
};

export const ProductSalesRegion: UqInMap = {
    uq: uqs.jkProduct,
    type: 'map',
    entity: 'ProductSalesRegion',
    mapper: {
        product: 'ProductID@ProductX',
        arr1: {
            salesRegion: '^SalesRegionID@SalesRegion',
            isValid: '^IsValid',
        }
    },
    pull: `select top 1 ID, ProductID, SalesRegionID, IsValid
        from ProdData.dbo.Export_ProductSalesRegion where ID > @iMaxId order by ID`,
};

export const ProductLegallyProhibited: UqInMap = {
    uq: uqs.jkProduct,
    type: 'map',
    entity: 'ProductLegallyProhibited',
    mapper: {
        product: 'ProductID@ProductX',
        arr1: {
            salesRegion: '^SalesRegionID@SalesRegion',
            reason: '^Reason',
        }
    }
};