import { Joint, UqIn } from "../../uq-joint";
import * as _ from 'lodash';
import { ProductX, ProductChemical, ProductPackX, PriceX, ProductSalesRegion, ProductLegallyProhibited } from "../../settings/in/product";
import { execSql } from "../../mssql/tools";
import { ProductProductCategory } from "../../settings/in/productCategory";
import { logger } from "../../tools/logger";

export async function productPullWrite(joint: Joint, data: any) {

    try {
        // await joint.uqIn(Product, _.pick(data, ["ID", "BrandID", "ProductNumber", "Description", "DescriptionC"]));
        await joint.uqIn(ProductX, _.pick(data, ["ID", "ProductID", "BrandID", "ProductNumber", "Description", "DescriptionC", "IsValid"]));
        await joint.uqIn(ProductChemical, _.pick(data, ["ProductID", "ChemicalID", "Purity", "CAS", "MolecularFomula", "MolecularWeight"]));
        return true;
    } catch (error) {
        logger.error(error);
        throw error;
    }
}

export async function productFirstPullWrite(joint: Joint, data: any) {

    try {
        await joint.uqIn(ProductX, _.pick(data, ["ID", "ProductID", "BrandID", "ProductNumber", "Description", "DescriptionC", "IsValid"]));

        let promises: PromiseLike<any>[] = [];
        promises.push(joint.uqIn(ProductChemical, _.pick(data, ["ProductID", "ChemicalID", "Purity", "CAS", "MolecularFomula", "MolecularWeight"])));
        let productId = data["ProductID"];

        let promisesSql: PromiseLike<any>[] = [];
        let packsql = `
            select  j.jkcat as ID, j.jkcat as PackingID, j.jkid as ProductID, j.PackNr, j.Quantity, j.Unit as Name
                    from zcl_mess.dbo.jkcat j
                    where j.jkid = @ProductID and j.unit in ( select unitE from opdata.dbo.supplierPackingUnit )
                    order by j.jkcat`;
        promisesSql.push(execSql(packsql, [{ 'name': 'ProductID', 'value': productId }]));

        let readProductSalesRegion = `
            select ExCID as ID, jkid as ProductID, market_code as SalesRegionID, IsValid
                from zcl_mess.dbo.ProductsLocation where jkid = @ProductID`;
        promisesSql.push(execSql(readProductSalesRegion, [{ 'name': 'ProductID', 'value': productId }]));

        /*
        let readProductLegallyProhibited = `
            select jkid + market_code as ID, jkid as ProductID, market_code as SalesRegionID, left(description, 20) as Reason
                from zcl_mess.dbo.sc_safe_ProdCache where jkid = @ProductID`;
        promisesSql.push(execSql(readProductLegallyProhibited, [{ 'name': 'ProductID', 'value': productId }]));

        let readProductProductCategory = `
            select ID, ID as SaleProductProductCategoryID, SaleProductID, ProductCategoryID, IsValid
                    from opdata.dbo.SaleProductProductCategory where SaleProductID = @ProductID order by ID`;
        promisesSql.push(execSql(readProductProductCategory, [{ 'name': 'ProductID', 'value': productId }]));
        */

        let sqlResult = await Promise.all(promisesSql);
        promises.push(pushRecordset(joint, sqlResult[0], ProductPackX));
        promises.push(pushRecordset(joint, sqlResult[1], ProductSalesRegion));
        // promises.push(pushRecordset(joint, sqlResult[2], ProductLegallyProhibited));
        // promises.push(pushRecordset(joint, sqlResult[3], ProductProductCategory));
        await Promise.all(promises);
        return true;
    } catch (error) {
        logger.error(error);
        throw error;
    }
}

export async function packFirstPullWrite(joint: Joint, data: any) {

    try {
        await joint.uqIn(ProductPackX, data);
        let packId = data["PackingID"];

        let pricesql = `
            select jp.ExCID as ID, jp.jkcat as PackingID, j.jkid as ProductID
                    , jp.market_code as SalesRegionID, jp.Price, jp.Currency, jp.Expire_Date, JP.Discontinued
                    from zcl_mess.dbo.jkcat_price jp inner join zcl_mess.dbo.jkcat j on jp.jkcat = j.jkcat
                    where jp.jkcat = @PackingID`;
        let priceResult = await execSql(pricesql, [{ 'name': 'PackingID', 'value': packId }]);
        await pushRecordset(joint, priceResult, PriceX);
        return true;
    } catch (error) {
        logger.error(error);
        throw error;
    }
}

export function pushRecordset(joint: Joint, result: any, uqIn: UqIn) {
    if (result !== undefined) {
        let { recordset } = result;
        let { firstPullWrite, pullWrite } = uqIn;
        let promises: PromiseLike<any>[] = [];
        for (var i = 0; i < recordset.length; i++) {
            let row = recordset[i];
            if (firstPullWrite) {
                promises.push(firstPullWrite(joint, row));
                // await firstPullWrite(joint, row);
            } else if (pullWrite) {
                promises.push(pullWrite(joint, row));
                // await pullWrite(joint, row);
            } else {
                promises.push(joint.uqIn(uqIn, row));
                // await joint.uqIn(uqIn, row);
            }
        }
        return Promise.all(promises);
    }
}