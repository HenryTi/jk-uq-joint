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
/*
const _in = {
    'Language': Lanugage,
    'Country': Country,
    'Province': Province,
    'City': City,
    'County': County,
    'Address': Address,
    'Currency': Currency,
    'SalesRegion': SalesRegion,
    'PackType': PackType,
    'PackTypeMapToStandard': PackTypeMapToStandard,
    'PackTypeStandard': PackTypeStandard,

    'Chemical': Chemical,

    'Brand': Brand,
    'BrandSalesRegion': BrandSalesRegion,
    'BrandDeliveryTime': BrandDeliveryTime,

    'Product': Product,
    'ProductChemical': ProductChemical,
    'ProductSalesRegion': ProductSalesRegion,
    'ProductLegallyProhibited': ProductLegallyProhibited,

    'ProductPackType': ProductPackType,
    'ProductPack': ProductPack,
    'Price': Price,

    'ProductX': ProductX,
    'ProductPackX': ProductPackX,
    'PriceX': PriceX,

    'ProductCategory': ProductCategory,
    'ProductCategoryLanguage': ProductCategoryLanguage,
    'ProductProductCategory': ProductProductCategory,

    'Warehouse': Warehouse,
    'SalesRegionWarehouse': SalesRegionWarehouse,

    'Promotion': Promotion,
    'PromotionSalesRegion': PromotionSalesRegion,
    'PromotionLanguage': PromotionLanguage,
    'PromotionPack': PromotionPack,

    'Customer': Customer,
    'Organization': Organization,
    'OrganizationCustomer': OrganizationCustomer,
    'CustomerContact': CustomerContact,
    'CustomerContacts': CustomerContacts,
    // 'CustomerInvoiceContact': CustomerInvoiceContact,
    'Contact': Contact,
}

export default _in;
*/
const usqIns = [
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
    chemical_1.Chemical,
    product_1.Brand,
    product_1.BrandSalesRegion,
    product_1.BrandDeliveryTime,
    product_1.Product,
    product_1.ProductChemical,
    product_1.ProductSalesRegion,
    product_1.ProductLegallyProhibited,
    /*
    ProductPackType,
    ProductPack,
    Price,
    */
    product_1.ProductX,
    product_1.ProductPackX,
    product_1.PriceX,
    productCategory_1.ProductCategory,
    productCategory_1.ProductCategoryLanguage,
    productCategory_1.ProductProductCategory,
    warehouse_1.Warehouse,
    warehouse_1.SalesRegionWarehouse,
    promotion_1.Promotion,
    promotion_1.PromotionSalesRegion,
    promotion_1.PromotionLanguage,
    promotion_1.PromotionPack,
    customer_1.Customer,
    customer_1.Organization,
    customer_1.OrganizationCustomer,
    customer_1.CustomerContact,
    customer_1.CustomerContacts,
    // 'CustomerInvoiceContact': CustomerInvoiceContact,
    customer_1.Contact,
];
exports.default = usqIns;
//# sourceMappingURL=index.js.map