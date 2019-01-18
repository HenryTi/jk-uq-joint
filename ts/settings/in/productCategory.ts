import { UsqInTuid, UsqInMap, UsqInTuidArr, UsqIn } from "../../usq-joint";
import { usqs } from "../usqs";

export const ProductCategory: UsqInTuid = {
    usq: usqs.jkProduct,
    type: 'tuid',
    entity: 'ProductCategory',
    key: 'ID',
    mapper: {
        $id: 'ID@ProductCategory',
        no: "ID",
        parent: "ParentProductCategoryID",
        isLeaf: "IsLeaf",
        orderWithinParent: "OrderWithinParentCategory",
    }
};

export const ProductCategoryLanguage: UsqInTuidArr = {
    usq: usqs.jkProduct,
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

export const ProductProductCategory: UsqInMap = {
    usq: usqs.jkProduct,
    type: 'map',
    entity: 'ProductProductCategory',
    mapper: {
        product: "SaleProductID@ProductX",
        arr1: {
            category: "^ProductCategoryID@ProductCategory"
        },
    }
};