"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqls_1 = require("./converter/sqls");
const productCategory_1 = require("../settings/in/productCategory");
/** */
exports.pulls = [
    /*
    { read: sqls.readLanguage, uqIn: Language },
    { read: sqls.readCountry, uqIn: Country },
    { read: sqls.readProvince, uqIn: Province },
    { read: sqls.readCity, uqIn: City },
    { read: sqls.readCounty, uqIn: County },
    { read: sqls.readPackTypeStandard, uqIn: PackTypeStandard },
    { read: sqls.readPackType, uqIn: PackType},
    { read: sqls.readCurrency, uqIn: Currency },
    { read: sqls.readSalesRegion, uqIn: SalesRegion },
    { read: sqls.readInvoiceType, uqIn: InvoiceType },
    { read: sqls.readEmployee, uqIn: Employee },
    */
    /*
    // 库存
    { read: sqls.readWarehouse, uqIn: Warehouse },
    { read: sqls.readSalesRegionWarehouse, uqIn: SalesRegionWarehouse },
    */
    // 产品相关的数据表
    // 目录树
    { read: sqls_1.sqls.readProductCategory, uqIn: productCategory_1.ProductCategory },
    { read: sqls_1.sqls.readProductCategoryLanguage, uqIn: productCategory_1.ProductCategoryLanguage },
    { read: sqls_1.sqls.readProductProductCategory, uqIn: productCategory_1.ProductProductCategory },
];
//# sourceMappingURL=pulls.js.map