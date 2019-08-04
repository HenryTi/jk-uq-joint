"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqls_1 = require("./converter/sqls");
const productCategory_1 = require("../settings/in/productCategory");
const Address_1 = require("../settings/in/Address");
const salesRegion_1 = require("../settings/in/salesRegion");
const chemical_1 = require("../settings/in/chemical");
const product_1 = require("../settings/in/product");
const warehouse_1 = require("../settings/in/warehouse");
const customer_1 = require("../settings/in/customer");
const promotion_1 = require("../settings/in/promotion");
const customerDiscount_1 = require("../settings/in/customerDiscount");
const hr_1 = require("../settings/in/hr");
/** */
exports.pulls = {
    "Language": { read: sqls_1.sqls.readLanguage, uqIn: salesRegion_1.Language },
    "Country": { read: sqls_1.sqls.readCountry, uqIn: Address_1.Country },
    "Province": { read: sqls_1.sqls.readProvince, uqIn: Address_1.Province },
    "City": { read: sqls_1.sqls.readCity, uqIn: Address_1.City },
    "County": { read: sqls_1.sqls.readCounty, uqIn: Address_1.County },
    "PackTypeStandard": { read: sqls_1.sqls.readPackTypeStandard, uqIn: salesRegion_1.PackTypeStandard },
    "PackType": { read: sqls_1.sqls.readPackType, uqIn: salesRegion_1.PackType },
    "Currency": { read: sqls_1.sqls.readCurrency, uqIn: salesRegion_1.Currency },
    "SalesRegion": { read: sqls_1.sqls.readSalesRegion, uqIn: salesRegion_1.SalesRegion },
    "InvoiceType": { read: sqls_1.sqls.readInvoiceType, uqIn: salesRegion_1.InvoiceType },
    "Employee": { read: sqls_1.sqls.readEmployee, uqIn: hr_1.Employee },
    // 库存
    "Warehouse": { read: sqls_1.sqls.readWarehouse, uqIn: warehouse_1.Warehouse },
    "SalesRegionWarehouse": { read: sqls_1.sqls.readSalesRegionWarehouse, uqIn: warehouse_1.SalesRegionWarehouse },
    // 产品相关的数据表
    // 目录树
    "ProductCategory": { read: sqls_1.sqls.readProductCategory, uqIn: productCategory_1.ProductCategory },
    "ProductCategoryLanguage": { read: sqls_1.sqls.readProductCategoryLanguage, uqIn: productCategory_1.ProductCategoryLanguage },
    "ProductProductCategory": { read: sqls_1.sqls.readProductProductCategory, uqIn: productCategory_1.ProductProductCategory },
    // 品牌
    "Brand": { read: sqls_1.sqls.readBrand, uqIn: product_1.Brand },
    "Chemical": { read: sqls_1.sqls.readChemical, uqIn: chemical_1.Chemical },
    // 产品
    "ProductX": { read: sqls_1.sqls.readProduct, uqIn: product_1.ProductX },
    // 客户和客户单位基本信息
    "Organization": { read: sqls_1.sqls.readOrganization, uqIn: customer_1.Organization },
    "Customer": { read: sqls_1.sqls.readCustomer, uqIn: customer_1.Customer },
    "Agreement": { read: sqls_1.sqls.readAgreement, uqIn: customerDiscount_1.Agreement },
    // 市场活动
    "PromotionType": { read: sqls_1.sqls.readPromotionType, uqIn: promotion_1.PromotionType },
    "PromotionStatus": { read: sqls_1.sqls.readPromotionStatus, uqIn: promotion_1.PromotionStatus },
    "Promotion": { read: sqls_1.sqls.readPromotion, uqIn: promotion_1.Promotion },
};
//# sourceMappingURL=pulls.js.map