"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const usqs_1 = require("../usqs");
exports.ProductCategory = {
    usq: usqs_1.usqs.jkProduct,
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
    usq: usqs_1.usqs.jkProduct,
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
    usq: usqs_1.usqs.jkProduct,
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