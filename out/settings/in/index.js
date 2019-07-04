"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Address_1 = require("./Address");
const salesRegion_1 = require("./salesRegion");
const product_1 = require("./product");
const warehouse_1 = require("./warehouse");
const chemical_1 = require("./chemical");
const promotion_1 = require("./promotion");
const customer_1 = require("./customer");
const productCategory_1 = require("./productCategory");
const customerDiscount_1 = require("./customerDiscount");
const hr_1 = require("./hr");
const salestask_1 = require("./salestask");
const uqIns = [
    salestask_1.JkTaskType,
    salestask_1.JkTask,
    salesRegion_1.Language,
    Address_1.Country,
    Address_1.Province,
    Address_1.City,
    Address_1.County,
    Address_1.Address,
    salesRegion_1.Currency,
    salesRegion_1.SalesRegion,
    salesRegion_1.PackType,
    salesRegion_1.PackTypeMapToStandard,
    salesRegion_1.PackTypeStandard,
    salesRegion_1.InvoiceType,
    hr_1.Employee,
    chemical_1.Chemical,
    product_1.Brand,
    product_1.BrandSalesRegion,
    product_1.BrandDeliveryTime,
    product_1.ProductX,
    product_1.InvalidProduct,
    product_1.ProductChemical,
    product_1.ProductPackX,
    product_1.PriceX,
    product_1.ProductSalesRegion,
    product_1.ProductLegallyProhibited,
    productCategory_1.ProductCategory,
    productCategory_1.ProductCategoryLanguage,
    productCategory_1.ProductProductCategory,
    warehouse_1.Warehouse,
    warehouse_1.SalesRegionWarehouse,
    promotion_1.PromotionType,
    promotion_1.PromotionStatus,
    promotion_1.Promotion,
    promotion_1.PromotionSalesRegion,
    promotion_1.PromotionLanguage,
    promotion_1.PromotionPackDiscount,
    customer_1.Customer,
    customer_1.Organization,
    customer_1.OrganizationCustomer,
    customer_1.CustomerContact,
    customer_1.CustomerContacts,
    customer_1.CustomerHandler,
    customer_1.Contact,
    customer_1.InvoiceInfo,
    customerDiscount_1.Agreement,
    customerDiscount_1.CustomerDiscount,
    customerDiscount_1.OrganizationDiscount,
];
exports.default = uqIns;
//# sourceMappingURL=index.js.map