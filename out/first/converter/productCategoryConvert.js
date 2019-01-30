"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
exports.readProductCategory = async (maxId) => {
    let sqlstring = `select top 1 pc.ProductCategoryID as ID, pc.ParentProductCategoryID, pc.OrderWithinParentCatetory as OrderWithinParentCategory,
        pc.IsLeaf, pc.IsValid, pc.IsShow from opdata.dbo.ProductCategory pc
        where pc.ProductCategoryID > '${maxId}' order by pc.ProductCategoryID`;
    return await _1.read(sqlstring);
};
exports.readProductCategoryLanguage = async (maxId) => {
    let sqlstring = `select top 1 ID, ProductCategoryID, LanguageID, ProductCategoryName
        from opdata.dbo.ProductCategoryLanguage where ID > '${maxId}' order by ID`;
    return await _1.read(sqlstring);
};
exports.readProductProductCategory = async (maxId) => {
    let sqlstring = `select top 1 ID, SaleProductID, ProductCategoryID, IsValid
        from opdata.dbo.SaleProductProductCategory where ID > '${maxId}' order by ID`;
    return await _1.read(sqlstring);
};
//# sourceMappingURL=productCategoryConvert.js.map