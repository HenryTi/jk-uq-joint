"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqls_1 = require("./converter/sqls");
const product_1 = require("../settings/in/product");
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

    // 库存
    { read: sqls.readWarehouse, uqIn: Warehouse },
    { read: sqls.readSalesRegionWarehouse, uqIn: SalesRegionWarehouse },

    // 产品相关的数据表
    // 品牌
    { read: sqls.readBrand, uqIn: Brand },
    // 目录树
    { read: sqls.readProductCategory, uqIn: ProductCategory },
    { read: sqls.readProductCategoryLanguage, uqIn: ProductCategoryLanguage },
    { read: sqls.readChemical, uqIn: Chemical },
    */
    // 产品
    { read: sqls_1.sqls.readProduct, uqIn: product_1.ProductX },
];
//# sourceMappingURL=pulls.js.map