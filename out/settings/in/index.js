"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Address_1 = require("./Address");
const salesRegion_1 = require("./salesRegion");
const product_1 = require("./product");
const warehouse_1 = require("./warehouse");
const chemical_1 = require("./chemical");
const promotion_1 = require("./promotion");
const customer_1 = require("./customer");
const _in = {
    'Language': salesRegion_1.Lanugage,
    'Country': Address_1.Country,
    'Province': Address_1.Province,
    'City': Address_1.City,
    'County': Address_1.County,
    'Address': Address_1.Address,
    'Currency': salesRegion_1.Currency,
    'SalesRegion': salesRegion_1.SalesRegion,
    'PackType': salesRegion_1.PackType,
    'PackTypeMapToStandard': salesRegion_1.PackTypeMapToStandard,
    'PackTypeStandard': salesRegion_1.PackTypeStandard,
    'Chemical': chemical_1.Chemical,
    'Brand': product_1.Brand,
    'BrandSalesRegion': product_1.BrandSalesRegion,
    'BrandDeliveryTime': product_1.BrandDeliveryTime,
    'Product': product_1.Product,
    'ProductChemical': product_1.ProductChemical,
    'ProductSalesRegion': product_1.ProductSalesRegion,
    'ProductLegallyProhibited': product_1.ProductLegallyProhibited,
    /*
    'ProductPackType': ProductPackType,
    'ProductPack': ProductPack,
    'Price': Price,
    */
    'ProductX': product_1.ProductX,
    'ProductPackX': product_1.ProductPackX,
    'PriceX': product_1.PriceX,
    'Warehouse': warehouse_1.Warehouse,
    'SalesRegionWarehouse': warehouse_1.SalesRegionWarehouse,
    'Promotion': promotion_1.Promotion,
    'PromotionSalesRegion': promotion_1.PromotionSalesRegion,
    'PromotionLanguage': promotion_1.PromotionLanguage,
    'PromotionPack': promotion_1.PromotionPack,
    'Customer': customer_1.Customer,
    'Organization': customer_1.Organization,
    'OrganizationCustomer': customer_1.OrganizationCustomer,
    'CustomerContact': customer_1.CustomerContact,
    'CustomerConsigneeContact': customer_1.CustomerConsigneeContact,
    'CustomerInvoiceContact': customer_1.CustomerInvoiceContact,
};
exports.default = _in;
//# sourceMappingURL=index.js.map