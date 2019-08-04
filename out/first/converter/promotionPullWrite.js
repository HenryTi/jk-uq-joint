"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dateformat_1 = __importDefault(require("dateformat"));
const _ = __importStar(require("lodash"));
const tools_1 = require("../../mssql/tools");
const promotion_1 = require("../../settings/in/promotion");
const productPullWrite_1 = require("./productPullWrite");
async function promotionFirstPullWrite(joint, data) {
    try {
        data["StartDate"] = data["StartDate"] && dateformat_1.default(data["StartDate"], "yyyy-mm-dd HH:MM:ss");
        data["EndDate"] = data["EndDate"] && dateformat_1.default(data["EndDate"], "yyyy-mm-dd HH:MM:ss");
        data["CreateTime"] = data["CreateTime"] && dateformat_1.default(data["CreateTime"], "yyyy-mm-dd HH:MM:ss");
        await joint.uqIn(promotion_1.Promotion, _.pick(data, ["ID", "Name", "Type", "Status", "StartDate", "EndDate", "CreateTime"]));
        let promises = [];
        promises.push(joint.uqIn(promotion_1.PromotionSalesRegion, _.pick(data, ["ID", "SalesRegionID"])));
        let promotionID = data["ID"];
        let promisesSql = [];
        let promotionLanguageSql = `
            select ExcID as ID, MarketingID as PromotionID, LanguageID, messageText as Description, Url
                    from dbs.dbo.MarketingMessageLanguages where MarketingID = @promotionID order by ExcID`;
        promisesSql.push(tools_1.execSql(promotionLanguageSql, [{ 'name': 'promotionID', 'value': promotionID }]));
        let readPromotionPacks = `
            select ExcID as ID, MarketingID as PromotionID, jkid as ProductID, jkcat as PackageID, activeDiscount as Discount, isnull(isStock, 0 ) as WhenHasStorage
                    from zcl_mess.dbo.ProductsMarketing where marketingID = @promotionID order by ExcID`;
        promisesSql.push(tools_1.execSql(readPromotionPacks, [{ 'name': 'promotionID', 'value': promotionID }]));
        let sqlResult = await Promise.all(promisesSql);
        promises.push(productPullWrite_1.pushRecordset(joint, sqlResult[0], promotion_1.PromotionLanguage));
        promises.push(productPullWrite_1.pushRecordset(joint, sqlResult[1], promotion_1.PromotionPackDiscount));
        await Promise.all(promises);
        return true;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
exports.promotionFirstPullWrite = promotionFirstPullWrite;
//# sourceMappingURL=promotionPullWrite.js.map