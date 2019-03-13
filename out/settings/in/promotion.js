"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = __importStar(require("lodash"));
const uqs_1 = require("../uqs");
exports.Promotion = {
    uq: uqs_1.uqs.jkPromotion,
    type: 'tuid',
    entity: 'Promotion',
    key: 'ID',
    mapper: {
        $id: 'ID@Promotion',
        no: "ID",
        name: 'Name',
        type: 'Type',
        status: 'Status',
        startDate: 'StartDate',
        endDate: 'EndDate',
        createTime: 'CreateTime',
    },
    pullWrite: async (joint, data) => {
        try {
            data["StartDate"] = data["StartDate"] && data["StartDate"].getTime();
            data["EndDate"] = data["StartDate"] && data["EndDate"].getTime();
            data["CreateTime"] = data["CreateTime"] && data["CreateTime"].getTime();
            await joint.uqIn(exports.Promotion, _.pick(data, ["ID", "Name", "Type", "Status", "StartDate", 'EndDate', 'CreateTime']));
            await joint.uqIn(exports.PromotionSalesRegion, _.pick(data, ["ID", "SalesRegionID"]));
            return true;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    }
};
exports.PromotionSalesRegion = {
    uq: uqs_1.uqs.jkPromotion,
    type: 'map',
    entity: 'PromotionSalesRegion',
    mapper: {
        promotion: 'ID@Promotion',
        arr1: {
            salesRegion: '^SalesRegionID@SalesRegion',
        }
    }
};
exports.PromotionLanguage = {
    uq: uqs_1.uqs.jkPromotion,
    type: 'map',
    entity: 'PromotionLanguage',
    mapper: {
        promotion: 'PromotionID@Promotion',
        arr1: {
            language: '^LanguageID@Language',
            description: '^Description',
            url: '^Url',
        }
    }
};
exports.PromotionPack = {
    uq: uqs_1.uqs.jkPromotion,
    type: 'map',
    entity: 'PromotionPack',
    mapper: {
        promotion: 'PromotionID@Promotion',
        arr1: {
            productx: '^ProductID@ProductX',
            packx: '^PackageID@ProductPackX',
            discount: '^Discount',
            whenHasStorage: '^WhenHasStorage',
        }
    }
};
//# sourceMappingURL=promotion.js.map