import { Joint, UqIn } from "../../uq-joint";
import dateFormat from 'dateformat';
import * as _ from 'lodash';
import { execSql } from "../../mssql/tools";
import { Promotion, PromotionSalesRegion, PromotionLanguage, PromotionPackDiscount } from "../../settings/in/promotion";
import { pushRecordset } from "./productPullWrite";

export async function promotionFirstPullWrite(joint: Joint, data: any) {

    try {
        data["StartDate"] = data["StartDate"] && dateFormat(data["StartDate"], "yyyy-mm-dd HH:MM:ss");
        data["EndDate"] = data["EndDate"] && dateFormat(data["EndDate"], "yyyy-mm-dd HH:MM:ss");
        data["CreateTime"] = data["CreateTime"] && dateFormat(data["CreateTime"], "yyyy-mm-dd HH:MM:ss");
        await joint.uqIn(Promotion, _.pick(data, ["ID", "Name", "Type", "Status", "StartDate", "EndDate", "CreateTime"]));
        let promises: PromiseLike<any>[] = [];
        promises.push(joint.uqIn(PromotionSalesRegion, _.pick(data, ["ID", "SalesRegionID"])));
        let promotionID = data["ID"];

        let promisesSql: PromiseLike<any>[] = [];
        let promotionLanguageSql = `
            select ExcID as ID, MarketingID as PromotionID, LanguageID, messageText as Description, Url
                    from dbs.dbo.MarketingMessageLanguages where MarketingID = @promotionID order by ExcID`;
        promisesSql.push(execSql(promotionLanguageSql, [{ 'name': 'promotionID', 'value': promotionID }]));

        let readPromotionPacks = `
            select ExcID as ID, MarketingID as PromotionID, jkid as ProductID, jkcat as PackageID, activeDiscount as Discount, isnull(isStock, 0 ) as WhenHasStorage
                    from zcl_mess.dbo.ProductsMarketing where marketingID = @promotionID order by ExcID`;
        promisesSql.push(execSql(readPromotionPacks, [{ 'name': 'promotionID', 'value': promotionID }]));

        let sqlResult = await Promise.all(promisesSql);
        promises.push(pushRecordset(joint, sqlResult[0], PromotionLanguage));
        promises.push(pushRecordset(joint, sqlResult[1], PromotionPackDiscount));
        await Promise.all(promises);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}