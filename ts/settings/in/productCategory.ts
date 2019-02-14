import { UqInTuid, UqInMap, UqInTuidArr, UqIn } from "../../uq-joint";
import { uqs } from "../uqs";

export const ProductCategory: UqInTuid = {
    uq: uqs.jkProduct,
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

export const ProductCategoryLanguage: UqInTuidArr = {
    uq: uqs.jkProduct,
    type: 'tuid-arr',
    entity: 'ProductCategory.ProductCategoryLanguage',
    key: "ID",
    owner: "ProductCategoryID",
    mapper: {
        // owner: "ProductCategoryID@ProductCategory",
        $id: "ID@ProductCategory.ProductCategoryLanguage",
        language: "LanguageID@Language",
        name: "ProductCategoryName",
    }
};

export const ProductProductCategory: UqInMap = {
    uq: uqs.jkProduct,
    type: 'map',
    entity: 'ProductProductCategory',
    mapper: {
        product: "SaleProductID@ProductX",
        arr1: {
            category: "^ProductCategoryID@ProductCategory"
        },
    }
};