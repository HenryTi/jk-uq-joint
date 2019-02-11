"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const uqOutRead_1 = require("./uqOutRead");
const _ = __importStar(require("lodash"));
const promotion_1 = require("../../settings/in/promotion");
exports.readPromotion = async (maxId) => {
    let sqlstring = `select top 1 MarketingID as ID, Name
        , mType as Type, mstatus as Status, PStartTime as StartDate, PendTime as EndDate, market_code as SalesRegionID, inputtime as CreateTime
        from dbs.dbo.Marketing where MarketingID > '${maxId}' order by MarketingID`;
    return await uqOutRead_1.read(sqlstring);
};
exports.readPromotionLanguage = async (maxId) => {
    let sqlstring = `select top 1 ExcID as ID, MarketingID as PromotionID, LanguageID, messageText as Description, Url
        from dbs.dbo.MarketingMessageLanguages where ExcID > '${maxId}' order by ExcID`;
    return await uqOutRead_1.read(sqlstring);
};
exports.readPromotionPack = async (maxId) => {
    let sqlstring = `select top 1 ExcID as ID, MarketingID as PromotionID, jkid as ProductID, jkcat as PackageID, activeDiscount as Discount, isStock as WhenHasStorage
        from zcl_mess.dbo.ProductsMarketing where ExcID > '${maxId}' order by ExcID`;
    return await uqOutRead_1.read(sqlstring);
};
async function promotionPullWrite(joint, data) {
    try {
        await joint.uqIn(promotion_1.Promotion, _.pick(data, ["ID", "Name", "Type", "Status", "StartDate", 'EndDate', 'CreateDate']));
        await joint.uqIn(promotion_1.PromotionSalesRegion, _.pick(data, ["ID", "SalesRegionID"]));
    }
    catch (error) {
        console.error(error);
    }
}
exports.promotionPullWrite = promotionPullWrite;
//# sourceMappingURL=promotionConveter.js.map