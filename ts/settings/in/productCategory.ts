import { UqInTuid, UqInMap, UqInTuidArr, UqIn } from "../../uq-joint";
import { us } from "../uqs";

export const ProductCategory: UqInTuid = {
    uq: us.jkProduct,
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
    uq: us.jkProduct,
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

export const ProductProductCategory: UqInMap = {
    uq: us.jkProduct,
    type: 'map',
    entity: 'ProductProductCategory',
    mapper: {
        product: "SaleProductID@ProductX",
        arr1: {
            category: "^ProductCategoryID@ProductCategory"
        },
    }
};