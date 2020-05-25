"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductProductCategory = exports.ProductCategoryLanguage = exports.ProductCategory = void 0;
const uqs_1 = require("../uqs");
const config_1 = __importDefault(require("config"));
const promiseSize = config_1.default.get("promiseSize");
exports.ProductCategory = {
    uq: uqs_1.uqs.jkProduct,
    type: 'tuid',
    entity: 'ProductCategory',
    key: 'ProductCategoryID',
    mapper: {
        $id: 'ProductCategoryID@ProductCategory',
        no: "ProductCategoryID",
        parent: "ParentProductCategoryID@ProductCategory",
        isLeaf: "IsLeaf",
        orderWithinParent: "OrderWithinParentCategory",
    },
    pull: `select top ${promiseSize} ID, ProductCategoryID, ParentProductCategoryID, OrderWithinParentCatetory as OrderWithinParentCategory,
        IsLeaf, IsValid, IsShow from ProdData.dbo.Export_ProductCategory
        where ID > @iMaxId order by ID`,
};
exports.ProductCategoryLanguage = {
    uq: uqs_1.uqs.jkProduct,
    type: 'tuid-arr',
    entity: 'ProductCategory_ProductCategoryLanguage',
    key: "ProductCategoryLanguageID",
    owner: "ProductCategoryID",
    mapper: {
        // owner: "ProductCategoryID@ProductCategory",
        $id: "ProductCategoryLanguageID@ProductCategory_ProductCategoryLanguage",
        language: "LanguageID@Language",
        name: "ProductCategoryName",
    },
    pull: `select top ${promiseSize} ID, ProductCategoryLanguageID, ProductCategoryID, LanguageID, ProductCategoryName
        from ProdData.dbo.Export_ProductCategoryLanguage where ID > @iMaxId order by ID`,
};
exports.ProductProductCategory = {
    uq: uqs_1.uqs.jkProduct,
    type: 'map',
    entity: 'ProductProductCategory',
    mapper: {
        product: "SaleProductID@ProductX",
        arr1: {
            category: "^ProductCategoryID@ProductCategory"
        },
    },
    pull: `select top ${promiseSize} ID, SaleProductProductCategoryID, SaleProductID, ProductCategoryID, IsValid
        from ProdData.dbo.Export_SaleProductProductCategory where ID > @iMaxId order by ID`,
};
//# sourceMappingURL=productCategory.js.map