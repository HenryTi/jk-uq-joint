import { Joint, UqIn } from "../../uq-joint";
import * as _ from 'lodash';
import { ProductX, ProductChemical, ProductPackX, PriceX, ProductSalesRegion, ProductLegallyProhibited } from "../../settings/in/product";
import { execSql } from "../../mssql/tools";

export async function productPullWrite(joint: Joint, data: any) {

    try {
        // await joint.uqIn(Product, _.pick(data, ["ID", "BrandID", "ProductNumber", "Description", "DescriptionC"]));
        await joint.uqIn(ProductX, _.pick(data, ["ID", "ProductID", "BrandID", "ProductNumber", "Description", "DescriptionC", "IsValid"]));
        await joint.uqIn(ProductChemical, _.pick(data, ["ID", "ChemicalID", "Purity", "CAS", "MolecularFomula", "MolecularWeight"]));
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function productFirstPullWrite(joint: Joint, data: any) {

    try {
        // await joint.uqIn(Product, _.pick(data, ["ID", "BrandID", "ProductNumber", "Description", "DescriptionC"]));
        await joint.uqIn(ProductX, _.pick(data, ["ID", "ProductID", "BrandID", "ProductNumber", "Description", "DescriptionC", "IsValid"]));
        await joint.uqIn(ProductChemical, _.pick(data, ["ID", "ChemicalID", "Purity", "CAS", "MolecularFomula", "MolecularWeight"]));
        let productId = data["ProductID"];

        let packsql = `
            select  j.jkcat as ID, j.jkcat as PackingID, j.jkid as ProductID, j.PackNr, j.Quantity, j.Unit as Name
                    from zcl_mess.dbo.jkcat j
                    where j.jkid = @ProductID and j.unit in ( select unitE from opdata.dbo.supplierPackingUnit )
                    order by j.jkcat`;
        let packResult = await execSql(packsql, [{ 'name': 'ProductID', 'value': productId }]);
        await pushRecordset(joint, packResult, ProductPackX);

        let readProductSalesRegion = `
            select ExCID as ID, jkid as ProductID, market_code as SalesRegionID, IsValid
                from zcl_mess.dbo.ProductsLocation where jkid = @ProductID order by ExCID`;
        let productSalesRegionResult = await execSql(readProductSalesRegion, [{ 'name': 'ProductID', 'value': productId }]);
        await pushRecordset(joint, productSalesRegionResult, ProductSalesRegion);

        let readProductLegallyProhibited = `
            select jkid + market_code as ID, jkid as ProductID, market_code as SalesRegionID, left(description, 20) as Reason
                from zcl_mess.dbo.sc_safe_ProdCache where jkid = @ProductID`;
        let productLegallyResult = await execSql(readProductLegallyProhibited, [{ 'name': 'ProductID', 'value': productId }]);
        await pushRecordset(joint, productLegallyResult, ProductLegallyProhibited);
        return true;
    } catch (error) {
        console.error(error);
        return false;
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
                    where jp.jkcat = @PackingID order by jp.jkcat`;
        let priceResult = await execSql(pricesql, [{ 'name': 'PackingID', 'value': packId }]);
        await pushRecordset(joint, priceResult, PriceX);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

async function pushRecordset(joint: Joint, result: any, uqIn: UqIn) {
    if (result !== undefined) {
        let { recordset } = result;
        let { firstPullWrite, pullWrite } = uqIn;
        for (var i = 0; i < recordset.length; i++) {
            let row = recordset[i];
            if (firstPullWrite) {
                await firstPullWrite(joint, row);
            } else if (pullWrite) {
                await pullWrite(joint, row);
            } else {
                await joint.uqIn(uqIn, row);
            }
        }
    }
}