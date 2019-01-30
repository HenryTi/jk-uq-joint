"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const usqs_1 = require("../usqs");
exports.Promotion = {
    usq: usqs_1.usqs.jkPromotion,
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
    }
};
exports.PromotionSalesRegion = {
    usq: usqs_1.usqs.jkPromotion,
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
    usq: usqs_1.usqs.jkPromotion,
    type: 'map',
    entity: 'PromotionLanguage',
    mapper: {
        promotion: 'PromotionID@Promotion',
        arr1: {
            language: '^LanguageID@Language',
            description: '^Description',
            url: 'Url',
        }
    }
};
exports.PromotionPack = {
    usq: usqs_1.usqs.jkPromotion,
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