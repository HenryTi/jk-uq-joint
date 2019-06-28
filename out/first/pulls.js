"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqls_1 = require("./converter/sqls");
const customerDiscount_1 = require("../settings/in/customerDiscount");
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

    // 产品相关的数据表
    // 目录树
    { read: sqls.readProductCategory, uqIn: ProductCategory },
    { read: sqls.readProductCategoryLanguage, uqIn: ProductCategoryLanguage },
    // 品牌
    { read: sqls.readBrand, uqIn: Brand },
    */
    // { read: sqls.readChemical, uqIn: Chemical },
    // 产品
    // { read: sqls.readProduct, uqIn: ProductX },
    // 客户和客户单位基本信息
    // { read: sqls.readOrganization, uqIn: Organization },
    // { read: sqls.readCustomer, uqIn: Customer },
    { read: sqls_1.sqls.readAgreement, uqIn: customerDiscount_1.Agreement },
];
//# sourceMappingURL=pulls.js.map