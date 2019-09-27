import { UqInTuid, UqInMap, UqInTuidArr, UqIn } from "../../uq-joint";
import { uqs } from "../uqs";
import config from 'config';

const promiseSize = config.get<number>("promiseSize");

export const ProductCategory: UqInTuid = {
    uq: uqs.jkProduct,
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

export const ProductCategoryLanguage: UqInTuidArr = {
    uq: uqs.jkProduct,
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

export const ProductProductCategory: UqInMap = {
    uq: uqs.jkProduct,
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