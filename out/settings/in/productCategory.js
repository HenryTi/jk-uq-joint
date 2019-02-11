"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uqs_1 = require("../uqs");
exports.ProductCategory = {
    uq: uqs_1.us.jkProduct,
    type: 'tuid',
    entity: 'ProductCategory',
    key: 'ID',
    mapper: {
        $id: 'ID@ProductCategory',
        no: "ID",
        parent: "ParentProductCategoryID@ProductCategory",
        isLeaf: "IsLeaf",
        orderWithinParent: "OrderWithinParentCategory",
    }
};
exports.ProductCategoryLanguage = {
    uq: uqs_1.us.jkProduct,
    type: 'tuid-arr',
    entity: 'ProductCategory.ProductCategoryLanguage',
    key: "ID",
    owner: "ProductCategoryID",
    mapper: {
        // owner: "ProductCategoryID@ProductCategory",
        $id: "ID@ProductCategoryLanguage",
        language: "LanguageID@Language",
        name: "ProductCategoryName",
    }
};
exports.ProductProductCategory = {
    uq: uqs_1.us.jkProduct,
    type: 'map',
    entity: 'ProductProductCategory',
    mapper: {
        product: "SaleProductID@ProductX",
        arr1: {
            category: "^ProductCategoryID@ProductCategory"
        },
    }
};
//# sourceMappingURL=productCategory.js.map