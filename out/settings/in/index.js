"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Address_1 = require("./Address");
const salesRegion_1 = require("./salesRegion");
const product_1 = require("./product");
const chemical_1 = require("./chemical");
const hr_1 = require("./hr");
const uqIns = [
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
];
exports.default = uqIns;
//# sourceMappingURL=index.js.map