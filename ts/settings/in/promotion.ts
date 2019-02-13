import { UqInTuid, UqInMap } from "../../uq-joint";
import { uqs } from "../uqs";

export const Promotion: UqInTuid = {
    uq: uqs.jkPromotion,
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

export const PromotionSalesRegion: UqInMap = {
    uq: uqs.jkPromotion,
    type: 'map',
    entity: 'PromotionSalesRegion',
    mapper: {
        promotion: 'ID@Promotion',
        arr1: {
            salesRegion: '^SalesRegionID@SalesRegion',
        }
    }
};

export const PromotionLanguage: UqInMap = {
    uq: uqs.jkPromotion,
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

export const PromotionPack: UqInMap = {
    uq: uqs.jkPromotion,
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