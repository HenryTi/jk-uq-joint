import { UqInTuid, UqInMap, UqInTuidArr, UqIn, Joint, DataPullResult } from "uq-joint";
import { uqs } from "../uqs";
import { productPullWrite, productFirstPullWrite, packFirstPullWrite, pushRecordset } from "../../first/converter/productPullWrite";
import { execSql } from "../../mssql/tools";
import config from 'config';
import dateFormat from 'dateformat';
import { logger } from "../../tools/logger";
import { timeAsQueue } from "../../settings/timeAsQueue";
//import { execSql as myexecSql } from "../../uq-joint/db/mysql/tool";
import { isNull } from "lodash";
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
        salesLevel: "SalesLevel@PackSalesLevel"
    },
    pull: `select top ${promiseSize} ID, PackagingID as PackingID, ProductID
        , PackagingQuantity as PackNr, PackagingVolume as Quantity
        , PackagingUnit as Name, PackingType as SalesLevel
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

/**
 * 
 */
export const PackSalesLevel: UqInTuid = {
    uq: uqs.jkProduct,
    type: 'tuid',
    entity: 'PackSalesLevel',
    key: 'ID',
    mapper: {
        $id: 'ID@PackSalesLevel',
        no: "ID",
        name: "ID",
    }
}

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
    },
    pull: `SELECT TOP ${promiseSize} ID, jkid as ProductID,Market_code as SalesRegionID,Reason , case mark when 3 then '-' else '' end as [$]
            FROM ProdData.dbo.Export_ProductDangerous
            where ID > @iMaxId
            order by ID`,
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
    pull: pullProductMSDSFile
};

pullProductMSDSFile.lastLength = 0;
async function pullProductMSDSFile(joint: Joint, uqIn: UqInMap, queue: number): Promise<DataPullResult> {
    let sql = `select top --topn-- DATEDIFF(s, '1970-01-01', a.InputTime) as ID, c.jkid as ProductID
            , case a.LanguageID when 'CN' then 'zh-CN' when 'EN' then 'en' 
                when 'DE' then 'de' when 'EN-US' then 'en-US' 
                when 'FR' then 'fr' end as LanguageID
            , a.fileName + '.pdf' as FileName 
            from opdata.dbo.PProducts_MSDSInfo a inner join opdata.dbo.JKProdIDInOut b on a.OriginalID = b.JKIDIn
                inner join zcl_mess.dbo.Products c on c.OriginalID = b.JKIDOut and c.manufactory in ( 'A01', 'A10' )
            where a.InputTime >= DATEADD(s, @iMaxId, '1970-01-01')
                and a.FileType = 'PDF'
                and c.jkid not in ( select jkid from zcl_mess.dbo.Invalid_products )
            order by a.InputTime`
    try {
        let ret = await timeAsQueue(sql, queue, pullProductMSDSFile.lastLength);
        if (ret !== undefined) {
            pullProductMSDSFile.lastLength = ret.lastLength;
            return ret.ret;
        }
    } catch (error) {
        logger.error(error);
        throw error;
    }
}

export const ProductSpecFile: UqInMap = {
    uq: uqs.jkProduct,
    type: 'map',
    entity: 'ProductSpecFile',
    mapper: {
        product: "ProductID@ProductX",
        fileName: "FileName"
    },
    pull: pullProductSpecFile
}

pullProductSpecFile.lastLength = 0;
async function pullProductSpecFile(joint: Joint, uqIn: UqInMap, queue: number): Promise<DataPullResult> {
    let sql = `select top --topn-- DATEDIFF(s, '1970-01-01', a.UpdateDatetime) as ID, a.jkid as ProductID
            , a.filePath as FileName 
            from opdata.dbo.FileResource a
            where a.UpdateDatetime >= DATEADD(s, @iMaxId, '1970-01-01')
                and a.FileType = 0 and a.FillState = 1
            order by a.UpdateDatetime`
    try {
        let ret = await timeAsQueue(sql, queue, pullProductSpecFile.lastLength);
        if (ret !== undefined) {
            pullProductSpecFile.lastLength = ret.lastLength;
            return ret.ret;
        }
    } catch (error) {
        logger.error(error);
        throw error;
    }
}

export const ProductSalesRank: UqInMap = {
    uq: uqs.jkProduct,
    type: 'map',
    entity: 'ProductSalesRank',
    mapper: {
        product: "ProductID@ProductX",
        rank: "Rank"
    },
    pull: ` select top ${promiseSize}  ID, ProductID, Rank
            from    ProdData.dbo.Export_ProductSalesRank AS a
            where   a.ID > @iMaxId
            order by a.ID;`,
}
/*
// 内网与同花系统产品、包装、价格信息比对检查。
export const ProductxDiff: UqInMap = {
    uq: uqs.jkProduct,
    type: 'map',
    entity: 'ProductxDiff',
    mapper: {
        id: true,
        jkid: true,
    },
    pull: async (joint: Joint, uqin: UqInMap, queue: number) => {
        let currentID: number;
        let getQueue = `select id from product.tv_productx where id > ${queue} limit 1`;
        let queueResult = await myexecSql(getQueue);
        let currentJKID: string;
        if (queueResult.length === 1) {
            currentID = queueResult[0].id;
            currentJKID = queueResult[0].jkid;
        }
        let sql = `
                    SELECT	a.no AS jkid, a.origin AS originalid, a.description, a.descriptionc,
                    b.jkcat,d.no AS marketcode,b.radiox AS packnr,b.radioy AS quantity,b.unit,
                    c.expiredate,c.discountinued,c.retail AS price,e.name AS currency
                    FROM	product.tv_productx a
                        LEFT JOIN product.tv_productx_packx b ON a.id=b.owner
                        LEFT JOIN product.tv_pricex c ON a.$unit=c.$unit AND a.id=c.product AND b.id=c.pack
                        LEFT JOIN common.tv_salesregion d ON c.salesregion=d.id
                        LEFT JOIN common.tv_currency e ON d.currency=e.id
                    WHERE	a.no=?
                    ORDER BY b.id`;
        //let result = await myexecSql(sql, [currentID]);
        let result = await myexecSql(sql, [currentJKID]);
        let round = 0;
        while (result.length === 0 && round < 300) {
            currentID++;
            round++;
            result = await myexecSql(sql, [currentID]);
        }
        if (result.length > 0) {
            let { jkid, originalid, description, descriptionc } = result[0];
            let data = [{ jkid, originalid, description, descriptionc, packs: [] }];
            result.forEach((e: any) => {
                let d = new Date(e.expiredate && dateFormat(e.expiredate, "yyyy-mm-dd HH:MM:ss"));
                let expiredate = dateFormat(d.setHours(d.getHours() - 8), "yyyy-mm-dd HH:MM:ss");
                if (e.jkcat !== null) {
                    data[0].packs.push({
                        jkcat: e.jkcat, marcketcode: e.marketcode, packnr: e.packnr,
                        quantity: e.quantity, unit: e.unit, expiredate: expiredate,
                        discountinued: e.discountinued, price: e.price, currency: e.currency
                    });
                }
            });
            return { lastPointer: currentID, data: data };
        }
    },
    pullWrite: async (joint: Joint, uqin: UqInMap, data: any) => {

        let { jkid, originalid, description, descriptionc, packs } = data;
        console.log(jkid);
        let diff = { jkid, diffs: [] };
        let sql = `
                    SELECT	p.JKID as cjkid,p.OriginalID as coriginalid,p.Description as cdescription,p.DescriptionC AS cdescriptionc,
                    jc.JKCat AS cjkcat,jc.PackNr AS cpacknr,jc.Quantity AS cquantity,jc.Unit AS cunit,
                    jcp.Market_Code AS cmarketcode,jcp.Expire_date AS cexpiredate,jcp.Discontinued AS cdiscontinued,jcp.Price AS cprice,REPLACE(jcp.Currency,' ','') AS ccurrency
                    FROM    zcl_mess.dbo.products p
                            LEFT JOIN zcl_mess.dbo.jkcat jc ON p.JKID=jc.JKid
                            LEFT JOIN zcl_mess.dbo.jkcat_price jcp ON jc.JKCat=jcp.Jkcat
                            LEFT JOIN zcl_mess.dbo.manufactory m ON p.Manufactory=m.code
                    WHERE   p.JKID= @jkid`;
        let result = await execSql(sql, [{ 'name': 'jkid', 'value': jkid }]);
        let { rowsAffected, recordset } = result;
        if (rowsAffected != 0) {
            let { cjkid, coriginalid, cdescription, cdescriptionc } = recordset[0];
            if (cjkid !== undefined) {
                if (originalid !== coriginalid) {
                    diff.diffs.push({ originalid: originalid, coriginalid: coriginalid });
                }
                if (description !== cdescription) {
                    diff.diffs.push({ description: description, cdescription: cdescription });
                }
                if (descriptionc !== cdescriptionc) {
                    diff.diffs.push({ description: descriptionc, cdescriptionc: cdescriptionc });
                }
            } else {
                diff.diffs.push({ jkid: jkid, cjkid: undefined });
            }
        }




        packs.forEach(p => {
            let { jkcat, marcketcode, packnr, quantity, unit, expiredate, discountinued, price, currency } = p;
            let cp = recordset.find(cp => cp.cjkcat === jkcat && cp.cmarketcode === marcketcode);
            if (cp !== undefined) {
                let { cpacknr, cquantity, cunit, cexpiredate, cdiscontinued, cprice, ccurrency } = cp;

                //let d = new Date(cexpiredate && dateFormat(cexpiredate, "yyyy-mm-dd HH:MM:ss"));
                //cexpiredate = dateFormat(d.setHours(d.getHours() - 8), "yyyy-mm-dd HH:MM:ss");
                let d1 = new Date(cexpiredate);
                let d2 = new Date(expiredate);

                let d3 = (d1.getTime() / (1000 * 60 * 60) - d2.getTime() / (1000 * 60 * 60));

                //console.log(d3);
                if (packnr !== cpacknr) {
                    diff.diffs.push({ jkcat, marcketcode, packnr: packnr, cpacknr: cpacknr });
                }
                if (quantity !== cquantity) {
                    diff.diffs.push({ jkcat, marcketcode, quantity: quantity, cquantity: cquantity });
                }
                if (unit !== cunit) {
                    diff.diffs.push({ jkcat, marcketcode, unit: unit, cunit: cunit });
                }
                // 有效期允许误差在24小时内
                if (d3 > 24) {
                    diff.diffs.push({ jkcat, marcketcode, expiredate: expiredate, cexpiredate: cexpiredate });
                }
                if (discountinued !== cdiscontinued) {
                    diff.diffs.push({ jkcat, marcketcode, discountinued: discountinued, cdiscontinued: cdiscontinued });
                }
                if (price !== cprice) {
                    diff.diffs.push({ jkcat, marcketcode, price: price, cprice: cprice });
                }
                // 价格误差允许在0.1内
                let priceDiff = Math.abs(price - cprice);
                if (priceDiff > 0.1) {
                    diff.diffs.push({ jkcat, marcketcode, price: price, cprice: cprice });
                }
                if (currency !== ccurrency) {
                    diff.diffs.push({ jkcat, marcketcode, currency: currency, ccurrency: ccurrency });
                }
            } else {
                diff.diffs.push({
                    jkcat: jkcat, marcketcode: marcketcode, cjkcat: undefined, cmarcketcode: undefined
                });
            }
        });
        if (diff.diffs.length > 0) {
            let isql = "insert into ProdData.dbo.ProductDiff(jkid,note) values(@jkid,@note)";
            //console.log(JSON.stringify(diff.diffs));
            await execSql(isql, [
                { name: 'jkid', value: jkid },
                { name: "note", value: JSON.stringify(diff.diffs) }
            ]);
        }
        return true;
    }
}

// 根据内网与同花系统产品、包装、价格信比对检查结果二次检查。
export const ProductxDiffResultCheck2nd: UqInMap = {
    uq: uqs.jkProduct,
    type: 'map',
    entity: 'ProductxDiffResultCheck2nd',
    mapper: {
        id: true,
        jkid: true,
    },
    pull: async (joint: Joint, uqin: UqInMap, queue: number) => {
        let currentID: number;
        // 根据第一次检查差异数据结果进行二次检查,获取id序列号、JKID
        let getQueue = `SELECT top 1 id,jkid FROM ProdData.dbo.ProductDiff where id<112902 and id > ${queue} `;
        let queueResult = await execSql(getQueue);
        let { rowsAffected, recordset } = queueResult;
        let currentJKID: string;
        if (recordset.length === 1) {
            currentID = recordset[0].id;
            currentJKID = recordset[0].jkid;
        }
        //根据jkid从同花系统中获取产品、包装、价格数据
        let sql = `
                    SELECT	a.no AS jkid, a.origin AS originalid, a.description, a.descriptionc,
                    b.jkcat,d.no AS marketcode,b.radiox AS packnr,b.radioy AS quantity,b.unit,
                    c.expiredate,c.discountinued,c.retail AS price,e.name AS currency
                    FROM	product.tv_productx a
                        LEFT JOIN product.tv_productx_packx b ON a.id=b.owner
                        LEFT JOIN product.tv_pricex c ON a.$unit=c.$unit AND a.id=c.product AND b.id=c.pack
                        LEFT JOIN common.tv_salesregion d ON c.salesregion=d.id
                        LEFT JOIN common.tv_currency e ON d.currency=e.id
                    WHERE	a.no=?
                    ORDER BY b.id`;

        let result = await myexecSql(sql, [currentJKID]);
        let round = 0;
        while (result.length === 0 && round < 300) {
            currentID++;
            round++;
            result = await myexecSql(sql, [currentID]);
        }
        if (result.length > 0) {
            let { jkid, originalid, description, descriptionc } = result[0];
            let data = [{ jkid, originalid, description, descriptionc, packs: [] }];
            result.forEach((e: any) => {
                let d = new Date(e.expiredate && dateFormat(e.expiredate, "yyyy-mm-dd HH:MM:ss"));
                let expiredate = dateFormat(d.setHours(d.getHours() - 8), "yyyy-mm-dd HH:MM:ss");
                if (e.jkcat !== null) {
                    data[0].packs.push({
                        jkcat: e.jkcat, marcketcode: e.marketcode, packnr: e.packnr,
                        quantity: e.quantity, unit: e.unit, expiredate: expiredate,
                        discountinued: e.discountinued, price: e.price, currency: e.currency
                    });
                }
            });
            return { lastPointer: currentID, data: data };
        }
    },
    pullWrite: async (joint: Joint, uqin: UqInMap, data: any) => {

        let { jkid, originalid, description, descriptionc, packs } = data;
        console.log(jkid);
        let diff = { jkid, diffs: [] };
        //从内部系统T182获取产品、包装、价格数据
        let sql = `
                    SELECT	p.JKID as cjkid,p.OriginalID as coriginalid,p.Description as cdescription,p.DescriptionC AS cdescriptionc,
                    jc.JKCat AS cjkcat,jc.PackNr AS cpacknr,jc.Quantity AS cquantity,jc.Unit AS cunit,
                    jcp.Market_Code AS cmarketcode,jcp.Expire_date AS cexpiredate,jcp.Discontinued AS cdiscontinued,jcp.Price AS cprice,REPLACE(jcp.Currency,' ','') AS ccurrency
                    FROM    zcl_mess.dbo.products p
                            LEFT JOIN zcl_mess.dbo.jkcat jc ON p.JKID=jc.JKid
                            LEFT JOIN zcl_mess.dbo.jkcat_price jcp ON jc.JKCat=jcp.Jkcat
                            LEFT JOIN zcl_mess.dbo.manufactory m ON p.Manufactory=m.code
                    WHERE   p.JKID= @jkid`;
        let result = await execSql(sql, [{ 'name': 'jkid', 'value': jkid }]);
        let { rowsAffected, recordset } = result;
        if (rowsAffected != 0) {
            let { cjkid, coriginalid, cdescription, cdescriptionc } = recordset[0];
            if (cjkid !== undefined) {
                if (originalid !== coriginalid) {
                    diff.diffs.push({ originalid: originalid, coriginalid: coriginalid });
                }
                if (description !== cdescription) {
                    diff.diffs.push({ description: description, cdescription: cdescription });
                }
                if (descriptionc !== cdescriptionc) {
                    diff.diffs.push({ description: descriptionc, cdescriptionc: cdescriptionc });
                }
            } else {
                diff.diffs.push({ jkid: jkid, cjkid: undefined });
            }
        }




        packs.forEach(p => {
            let { jkcat, marcketcode, packnr, quantity, unit, expiredate, discountinued, price, currency } = p;
            let cp = recordset.find(cp => cp.cjkcat === jkcat && cp.cmarketcode === marcketcode);
            if (cp !== undefined) {
                let { cpacknr, cquantity, cunit, cexpiredate, cdiscontinued, cprice, ccurrency } = cp;

                //let d = new Date(cexpiredate && dateFormat(cexpiredate, "yyyy-mm-dd HH:MM:ss"));
                //cexpiredate = dateFormat(d.setHours(d.getHours() - 8), "yyyy-mm-dd HH:MM:ss");
                let d1 = new Date(cexpiredate);
                let d2 = new Date(expiredate);

                let d3 = (d1.getTime() / (1000 * 60 * 60) - d2.getTime() / (1000 * 60 * 60));

                //console.log(d3);
                if (packnr !== cpacknr) {
                    diff.diffs.push({ jkcat, marcketcode, packnr: packnr, cpacknr: cpacknr });
                }
                if (quantity !== cquantity) {
                    diff.diffs.push({ jkcat, marcketcode, quantity: quantity, cquantity: cquantity });
                }
                if (unit !== cunit) {
                    diff.diffs.push({ jkcat, marcketcode, unit: unit, cunit: cunit });
                }
                // 有效期允许误差在24小时内
                if (d3 > 24) {
                    diff.diffs.push({ jkcat, marcketcode, expiredate: expiredate, cexpiredate: cexpiredate });
                }
                if (discountinued !== cdiscontinued) {
                    diff.diffs.push({ jkcat, marcketcode, discountinued: discountinued, cdiscontinued: cdiscontinued });
                }
                // 价格误差允许在0.1内
                let priceDiff = Math.abs(price - cprice);
                if (priceDiff > 0.1) {
                    diff.diffs.push({ jkcat, marcketcode, price: price, cprice: cprice });
                }
                if (currency !== ccurrency && ccurrency !== null) {
                    diff.diffs.push({ jkcat, marcketcode, currency: currency, ccurrency: ccurrency });
                }
            } else {
                diff.diffs.push({
                    jkcat: jkcat, marcketcode: marcketcode, cjkcat: undefined, cmarcketcode: undefined
                });
            }
        });
        if (diff.diffs.length > 0) {
            let isql = "insert into ProdData.dbo.ProductDiff(jkid,note) values(@jkid,@note)";
            //console.log(JSON.stringify(diff.diffs));
            await execSql(isql, [
                { name: 'jkid', value: jkid },
                { name: "note", value: JSON.stringify(diff.diffs) }
            ]);
        }
        return true;
    }
}

*/
