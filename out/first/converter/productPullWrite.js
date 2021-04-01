"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushRecordset = exports.packFirstPullWrite = exports.productFirstPullWrite = exports.productPullWrite = void 0;
const _ = __importStar(require("lodash"));
const product_1 = require("../../settings/in/product");
const tools_1 = require("../../mssql/tools");
const logger_1 = require("../../tools/logger");
async function productPullWrite(joint, uqin, data) {
    try {
        await joint.uqIn(product_1.ProductX, _.pick(data, ["ID", "ProductID", "BrandID", "ProductNumber", "Description", "DescriptionC", "ChemicalID", "IsValid"]));
        await joint.uqIn(product_1.ProductChemical, _.pick(data, ["ProductID", "ChemicalID", "Purity", "CAS", "MolecularFomula", "MolecularWeight"]));
        return true;
    }
    catch (error) {
        logger_1.logger.error(error);
        throw error;
    }
}
exports.productPullWrite = productPullWrite;
async function productFirstPullWrite(joint, uqin, data) {
    try {
        await joint.uqIn(product_1.ProductX, _.pick(data, ["ID", "ProductID", "BrandID", "ProductNumber", "Description", "DescriptionC", "IsValid"]));
        let promises = [];
        promises.push(joint.uqIn(product_1.ProductChemical, _.pick(data, ["ProductID", "ChemicalID", "Purity", "CAS", "MolecularFomula", "MolecularWeight"])));
        let productId = data["ProductID"];
        let promisesSql = [];
        let packsql = `
            select  j.jkcat as ID, j.jkcat as PackingID, j.jkid as ProductID, j.PackNr, j.Quantity, j.Unit as Name
                    from zcl_mess.dbo.jkcat j
                    where j.jkid = @ProductID and j.unit in ( select unitE from opdata.dbo.supplierPackingUnit )
                    order by j.jkcat`;
        promisesSql.push(tools_1.execSql(packsql, [{ 'name': 'ProductID', 'value': productId }]));
        let readProductSalesRegion = `
            select ExCID as ID, jkid as ProductID, market_code as SalesRegionID, IsValid
                from zcl_mess.dbo.ProductsLocation where jkid = @ProductID`;
        promisesSql.push(tools_1.execSql(readProductSalesRegion, [{ 'name': 'ProductID', 'value': productId }]));
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
        promises.push(pushRecordset(joint, sqlResult[0], product_1.ProductPackX));
        promises.push(pushRecordset(joint, sqlResult[1], product_1.ProductSalesRegion));
        // promises.push(pushRecordset(joint, sqlResult[2], ProductLegallyProhibited));
        // promises.push(pushRecordset(joint, sqlResult[3], ProductProductCategory));
        await Promise.all(promises);
        return true;
    }
    catch (error) {
        logger_1.logger.error(error);
        throw error;
    }
}
exports.productFirstPullWrite = productFirstPullWrite;
async function packFirstPullWrite(joint, uqin, data) {
    try {
        await joint.uqIn(product_1.ProductPackX, data);
        let packId = data["PackingID"];
        let pricesql = `
            select jp.ExCID as ID, jp.jkcat as PackingID, j.jkid as ProductID
                    , jp.market_code as SalesRegionID, jp.Price, jp.Currency, jp.Expire_Date, JP.Discontinued
                    from zcl_mess.dbo.jkcat_price jp inner join zcl_mess.dbo.jkcat j on jp.jkcat = j.jkcat
                    where jp.jkcat = @PackingID`;
        let priceResult = await tools_1.execSql(pricesql, [{ 'name': 'PackingID', 'value': packId }]);
        await pushRecordset(joint, priceResult, product_1.PriceX);
        return true;
    }
    catch (error) {
        logger_1.logger.error(error);
        throw error;
    }
}
exports.packFirstPullWrite = packFirstPullWrite;
function pushRecordset(joint, result, uqIn) {
    if (result !== undefined) {
        let { recordset } = result;
        let { firstPullWrite, pullWrite } = uqIn;
        let promises = [];
        for (var i = 0; i < recordset.length; i++) {
            let row = recordset[i];
            if (firstPullWrite) {
                promises.push(firstPullWrite(joint, uqIn, row));
                // await firstPullWrite(joint, row);
            }
            else if (pullWrite) {
                promises.push(pullWrite(joint, uqIn, row));
                // await pullWrite(joint, row);
            }
            else {
                promises.push(joint.uqIn(uqIn, row));
                // await joint.uqIn(uqIn, row);
            }
        }
        return Promise.all(promises);
    }
}
exports.pushRecordset = pushRecordset;
//# sourceMappingURL=productPullWrite.js.map