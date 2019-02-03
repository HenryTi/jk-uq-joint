import { UsqOutConverter } from "../pulls";
import { read } from './usqOutRead'

export const readProductCategory: UsqOutConverter = async (maxId: string): Promise<{ lastId: string, data: any }> => {

    let sqlstring = `select top 1 pc.ProductCategoryID as ID, pc.ParentProductCategoryID, pc.OrderWithinParentCatetory as OrderWithinParentCategory,
        pc.IsLeaf, pc.IsValid, pc.IsShow from opdata.dbo.ProductCategory pc
        where pc.ProductCategoryID > '${maxId}' order by pc.ProductCategoryID`;
    return await read(sqlstring);
};

export const readProductCategoryLanguage: UsqOutConverter = async (maxId: string): Promise<{ lastId: string, data: any }> => {

    let sqlstring = `select top 1 ID, ProductCategoryID, LanguageID, ProductCategoryName
        from opdata.dbo.ProductCategoryLanguage where ID > '${maxId}' order by ID`;
    return await read(sqlstring);
};

export const readProductProductCategory: UsqOutConverter = async (maxId: string): Promise<{ lastId: string, data: any }> => {

    let sqlstring = `select top 1 ID, SaleProductID, ProductCategoryID, IsValid
        from opdata.dbo.SaleProductProductCategory where ID > '${maxId}' order by ID`;
    return await read(sqlstring);
};