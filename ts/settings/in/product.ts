import { UqInTuid, UqInMap, UqInTuidArr, UqIn, Joint, DataPullResult } from "uq-joint";
import { uqs } from "../uqs";
import { productPullWrite, productFirstPullWrite, packFirstPullWrite, pushRecordset } from "../../first/converter/productPullWrite";
import { execSql } from "../../mssql/tools";
import config from 'config';
import dateFormat from 'dateformat';
import { logger } from "../../tools/logger";
import { uqOutRead } from "first/converter/uqOutRead";

const promiseSize = config.get<number>("promiseSize");
const interval = config.get<number>("interval");

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
    pull: `select top ${promiseSize} ID, BrandID, BrandName
        from ProdData.dbo.Export_Brand where ID > @iMaxId order by ID`,
    firstPullWrite: async (joint: Joint, uqIn: UqIn, data: any): Promise<boolean> => {
        try {
            await joint.uqIn(Brand, data);
            let brandId = data['BrandID'];
            let promisesSql: PromiseLike<any>[] = [];
            let brandSalesRegionSql = `
                select ExcID as ID, code as BrandID, market_code as SalesRegionID, yesorno as Level
                        from zcl_mess.dbo.manufactoryMarket where code = @BrandID`;
            promisesSql.push(execSql(brandSalesRegionSql, [{ 'name': 'BrandID', 'value': brandId }]));

            let readBrandDeliveryTime = `
                select ID, BrandCode as BrandID, SaleRegionID as SalesRegionID, MinValue, MaxValue, Unit
                        , case [Restrict] when 'NoRestrict' then 0 else 1 end as [Restrict]
                        from zcl_mess.dbo.BrandDeliverTime where BrandCode = @BrandID and isValid = 1`;
            promisesSql.push(execSql(readBrandDeliveryTime, [{ 'name': 'BrandID', 'value': brandId }]));

            let sqlResult: any[] = []
            try {
                sqlResult = await Promise.all(promisesSql);
            } catch (error) {
                logger.error(error);
                throw error;
            }

            let promises: PromiseLike<any>[] = [];
            promises.push(pushRecordset(joint, sqlResult[0], BrandSalesRegion));
            promises.push(pushRecordset(joint, sqlResult[1], BrandDeliveryTime));
            await Promise.all(promises);
            return true;
        } catch (error) {
            logger.error(error);
            throw error;
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
    pull: `select top ${promiseSize} ID, BrandID, SalesRegionID, BrandLevel as Level
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
    pull: `select top ${promiseSize} ID, BrandCode as BrandID, SaleRegionID as SalesRegionID, MinValue, MaxValue, Unit
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
        imageUrl: 'ChemicalID',
        isValid: 'IsValid',
    },
    pull: `select top ${promiseSize} ID, ProductID, BrandID, ProductNumber, Description, DescriptionC, CasNumber as CAS, ChemicalID
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
    pull: `select top ${promiseSize} pv.ID, pv.ProductID, p.manufactory as BrandID, p.originalId as ProductNumber, p.Description, p.DescriptionC
        , zcl_mess.dbo.fc_recas(p.CAS) as CAS, pc.ChemID as ChemicalID
        , p.mf as MolecularFormula, p.mw as MolecularWeight, p.Purity, p.LotNumber as MdlNumber, p.[Restrict], 0 as IsValid
        from ProdData.dbo.Export_Invalid_Product pv inner join zcl_mess.dbo.Products p on pv.ProductID = p.jkid
        inner join zcl_mess.dbo.ProductsChem pc on pc.jkid = p.jkid
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
    pull: `select top ${promiseSize} ID, PackagingID as PackingID, ProductID, PackagingQuantity as PackNr, PackagingVolume as Quantity, PackagingUnit as Name
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
    pull: `select top ${promiseSize} jp.ID, jp.PackagingID as PackingID, j.jkid as ProductID, jp.SalesRegionID, jp.Price
        , jp.Currency, jp.ExpireDate as Expire_Date, cast(jp.Discontinued as int) as Discontinued
        from ProdData.dbo.Export_PackagingSalesRegion jp inner join zcl_mess.dbo.jkcat j on jp.PackagingID = j.jkcat
        where jp.ID > @iMaxId order by jp.ID`,
    pullWrite: async (joint: Joint, uqin: UqIn, data: any) => {
        try {
            data["Expire_Date"] = data["Expire_Date"] && dateFormat(data["Expire_Date"], "yyyy-mm-dd HH:MM:ss");
            await joint.uqIn(PriceX, data);
            return true;
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }
};

export const AgentPrice: UqInMap = {
    uq: uqs.jkProduct,
    type: 'map',
    entity: 'AgentPrice',
    mapper: {
        product: "ProductId@ProductX",
        pack: "PackageId@ProductX_PackX",
        arr1: {
            salesRegion: "^SalesRegion@SalesRegion",
            expireDate: "^Expiredate",
            discountinued: "^Discontinued",
            agentPrice: "^AgencyPrice",
        }
    },
    pull: `select   top ${promiseSize}  ID, ProductId, PackageId, SalesRegion,AgencyPrice, Expiredate, Discontinued
            from    ProdData.dbo.Export_ProductAgencyPrice as a
            where  ID > @iMaxId order by  ID`,
    pullWrite: async (joint: Joint, uqin: UqIn, data: any) => {
        try {
            data["Expiredate"] = data["Expiredate"] && dateFormat(data["Expiredate"], "yyyy-mm-dd HH:MM:ss");
            await joint.uqIn(AgentPrice, data);
            return true;
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }
};

export const ProductChemical: UqInMap = {
    uq: uqs.jkProduct,
    type: 'map',
    entity: 'ProductChemical',
    mapper: {
        product: "ProductID@ProductX",
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
    pull: `select top ${promiseSize} ID, ProductID, SalesRegionID, IsValid
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

export const ProductExtensionProperty: UqInMap = {
    uq: uqs.jkProduct,
    type: 'map',
    entity: 'ProductExtensionProperty',
    mapper: {
        product: "ProductID@ProductX",
        englishAlias: "Synonymity",
        chineseAlias: "SynonymityC",
        MDL: true,
        EINECS: true,
        Beilstein: true,
        FlashPoint: "FP",
        MeltingPoint: "MP",
        BolingPoint: "BP",
        density: "Density",
    }
};

export const ProductMSDSFile: UqInMap = {
    uq: uqs.jkProduct,
    type: 'map',
    entity: 'ProductMSDSFile',
    mapper: {
        product: "ProductID@ProductX",
        arr1: {
            language: "^LanguageID@Language",
            fileName: "^FileName"
        }
    },
    pull: async (joint: Joint, uqIn: UqInMap, queue: number): Promise<DataPullResult> => {
        let step_seconds = Math.max(interval * 10 / 1000, 300);
        if ((queue - 8 * 60 * 60 + step_seconds) * 1000 > Date.now())
            return undefined;
        let nextQueue = queue + step_seconds;
        let sql = `select DATEDIFF(s, '1970-01-01', a.InputTime) + 1 as ID, c.jkid as ProductID
            , case a.LanguageID when 'CN' then 'zh-CN' when 'EN' then 'en' 
                when 'DE' then 'de' when 'EN-US' then 'en-US' end as LanguageID
            , a.fileName + '.pdf' as FileName 
            from opdata.dbo.PProducts_MSDSInfo a inner join opdata.dbo.JKProdIDInOut b on a.OriginalID = b.JKIDIn
            inner join zcl_mess.dbo.Products c on c.OriginalID = b.JKIDOut and c.manufactory in ( 'A01', 'A10' )
            where a.InputTime >= DATEADD(s, @iMaxId, '1970-01-01') and a.InputTime <= DATEADD(s, ${nextQueue}, '1970-01-01')
                and a.FileType = 'PDF'
            order by a.InputTime`
        try {
            let ret = await uqOutRead(sql, queue);
            if (ret === undefined) {
                ret = { lastPointer: nextQueue, data: [] };
            }
            return ret;
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }
};

export const ProductSpecFile: UqInMap = {
    uq: uqs.jkProduct,
    type: 'map',
    entity: 'ProductSpecFile',
    mapper: {
        product: "ProductID@ProductX",
        fileName: "FileName"
    },
    pull: async (joint: Joint, uqIn: UqInMap, queue: number): Promise<DataPullResult> => {
        let step_seconds = Math.max(interval * 10 / 1000, 300);
        if ((queue - 8 * 60 * 60 + step_seconds) * 1000 > Date.now())
            return undefined;
        let nextQueue = queue + step_seconds;
        let sql = `select DATEDIFF(s, '1970-01-01', a.UpdateDatetime) + 1 as ID, a.jkid as ProductID
            , a.filePath as FileName 
            from opdata.dbo.FileResource a
            where a.UpdateDatetime >= DATEADD(s, @iMaxId, '1970-01-01') and a.UpdateDatetime <= DATEADD(s, ${nextQueue}, '1970-01-01')
                and a.FileType = 0 and a.FillState = 1
            order by a.UpdateDatetime`
        try {
            let ret = await uqOutRead(sql, queue);
            if (ret === undefined) {
                ret = { lastPointer: nextQueue, data: [] };
            }
            return ret;
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }
}