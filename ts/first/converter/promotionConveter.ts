import { Joint } from "../../uq-joint";
import * as _ from 'lodash';
import { Promotion, PromotionSalesRegion } from "../../settings/in/promotion";

/*
export const readPromotion: UqOutConverter = async (maxId: string): Promise<{ lastId: string, data: any }> => {

    let sqlstring = `select top 1 MarketingID as ID, Name
        , mType as Type, mstatus as Status, PStartTime as StartDate, PendTime as EndDate, market_code as SalesRegionID, inputtime as CreateTime
        from dbs.dbo.Marketing where MarketingID > '${maxId}' order by MarketingID`;
    return await read(sqlstring);
};

export const readPromotionLanguage: UqOutConverter = async (maxId: string): Promise<{ lastId: string, data: any }> => {

    let sqlstring = `select top 1 ExcID as ID, MarketingID as PromotionID, LanguageID, messageText as Description, Url
        from dbs.dbo.MarketingMessageLanguages where ExcID > '${maxId}' order by ExcID`;
    return await read(sqlstring);
};

export const readPromotionPack: UqOutConverter = async (maxId: string): Promise<{ lastId: string, data: any }> => {

    let sqlstring = `select top 1 ExcID as ID, MarketingID as PromotionID, jkid as ProductID, jkcat as PackageID, activeDiscount as Discount, isStock as WhenHasStorage
        from zcl_mess.dbo.ProductsMarketing where ExcID > '${maxId}' order by ExcID`;
    return await read(sqlstring);
};
*/

export async function promotionPullWrite(joint: Joint, data: any) {

    try {
        await joint.uqIn(Promotion,  _.pick(data, ["ID", "Name", "Type", "Status", "StartDate", 'EndDate', 'CreateDate']));
        await joint.uqIn(PromotionSalesRegion, _.pick(data, ["ID", "SalesRegionID"]));
    } catch (error) {
        console.error(error);
    }
}