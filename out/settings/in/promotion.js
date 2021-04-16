"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionPackDiscount = exports.PromotionLanguage = exports.PromotionSalesRegion = exports.Promotion = exports.PromotionStatus = exports.PromotionType = void 0;
const _ = __importStar(require("lodash"));
const uqs_1 = require("../uqs");
const promotionPullWrite_1 = require("../../first/converter/promotionPullWrite");
const config_1 = __importDefault(require("config"));
const promiseSize = config_1.default.get("promiseSize");
exports.PromotionType = {
    uq: uqs_1.uqs.jkPromotion,
    type: 'tuid',
    entity: 'PromotionType',
    key: 'MarketingTypeID',
    mapper: {
        $id: 'MarketingTypeID@PromotionType',
        no: "MarketingTypeID",
        description: 'Description',
    },
    pull: `select top ${promiseSize} ID, MarketingTypeID, MarketingTypeName as Description
        from ProdData.dbo.Export_MarketingType where ID > @iMaxId order by ID`,
};
exports.PromotionStatus = {
    uq: uqs_1.uqs.jkPromotion,
    type: 'tuid',
    entity: 'PromotionStatus',
    key: 'MarketingStatusID',
    mapper: {
        $id: 'MarketingStatusID@PromotionStatus',
        no: "MarketingStatusID",
        description: 'Description',
    },
    pull: `select top ${promiseSize} ID, MarketingStatusID, MarketingStatusName as Description
        from ProdData.dbo.Export_MarketingStatus where ID > @iMaxId order by ID`,
};
exports.Promotion = {
    uq: uqs_1.uqs.jkPromotion,
    type: 'tuid',
    entity: 'Promotion',
    key: 'MarketingID',
    mapper: {
        $id: 'MarketingID@Promotion',
        no: "MarketingID",
        name: 'Name',
        type: 'Type@PromotionType',
        status: 'Status@PromotionStatus',
        startDate: 'StartDate',
        endDate: 'EndDate',
        createTime: 'CreateTime',
    },
    pull: `select top ${promiseSize} ID, MarketingID, Name, MarketingType as Type, MarketingStatus as Status, StartTime as StartDate
        , EndTime as EndDate, SalesRegionID, CreateTime
        from ProdData.dbo.Export_Marketing where ID > @iMaxId order by ID`,
    pullWrite: async (joint, uqin, data) => {
        try {
            data["StartDate"] = data["StartDate"] && data['StartDate'].getTime() / 1000; // dateFormat(data["StartDate"], "yyyy-mm-dd HH:MM:ss");
            data["EndDate"] = data["EndDate"] && data['EndDate'].getTime() / 1000; // dateFormat(data["EndDate"], "yyyy-mm-dd HH:MM:ss");
            data["CreateTime"] = data["CreateTime"] && data['CreateTime'].getTime() / 1000; // dateFormat(data["CreateTime"], "yyyy-mm-dd HH:MM:ss");
            await joint.uqIn(exports.Promotion, _.pick(data, ["ID", "MarketingID", "Name", "Type", "Status", "StartDate", 'EndDate', 'CreateTime']));
            // 下面这种方法是投机取巧将Map中MarkeingID为指定值的数据全部删除 - 不行，这个可能会在SalesRegion中引入无效值
            await joint.uqIn(exports.PromotionSalesRegion, { $: '-', 'MarketingID': data['MarketingID'] });
            await joint.uqIn(exports.PromotionSalesRegion, _.pick(data, ["MarketingID", "SalesRegionID"]));
            return true;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    },
    firstPullWrite: promotionPullWrite_1.promotionFirstPullWrite,
};
exports.PromotionSalesRegion = {
    uq: uqs_1.uqs.jkPromotion,
    type: 'map',
    entity: 'PromotionSalesRegion',
    mapper: {
        promotion: 'MarketingID@Promotion',
        arr1: {
            salesRegion: '^SalesRegionID@SalesRegion(-1)',
        }
    }
};
exports.PromotionLanguage = {
    uq: uqs_1.uqs.jkPromotion,
    type: 'map',
    entity: 'PromotionLanguage',
    mapper: {
        promotion: 'MarketingID@Promotion',
        arr1: {
            language: '^LanguageID@Language',
            description: '^Description',
            url: '^Url',
        }
    },
    pull: `select top ${promiseSize} ID, MarketingID, LanguageID, messageText as Description, Url
           from ProdData.dbo.Export_MarketingMessageLanguage where ID > @iMaxId order by ID`,
};
exports.PromotionPackDiscount = {
    uq: uqs_1.uqs.jkPromotion,
    type: 'map',
    entity: 'PromotionPackDiscount',
    mapper: {
        promotion: 'MarketingID@Promotion',
        product: 'ProductID@ProductX',
        arr1: {
            pack: '^PackageID@ProductX_PackX',
            discount: '^Discount',
            MustHasStorage: '^WhenHasStorage',
        }
    },
    pull: `select top ${promiseSize} a.ID, a.MarketingID, j.jkid as ProductID, a.PackagingID as PackageID, a.Discount, isnull(a.MustHasStorage, 0 ) as WhenHasStorage
          from ProdData.dbo.Export_ProductsMarketing a join zcl_mess.dbo.jkcat j on a.PackagingID = j.jkcat where a.ID > @iMaxId order by a.ID`,
};
//# sourceMappingURL=promotion.js.map