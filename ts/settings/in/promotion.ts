import * as _ from 'lodash';
import { UqInTuid, UqInMap, Joint } from "../../uq-joint";
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
    },
    pullWrite: async (joint: Joint, data: any) => {

        try {
            data["StartDate"] = data["StartDate"] && data["StartDate"].getTime();
            data["EndDate"] = data["StartDate"] && data["EndDate"].getTime();
            data["CreateTime"] = data["CreateTime"] && data["CreateTime"].getTime();
            await joint.uqIn(Promotion, _.pick(data, ["ID", "Name", "Type", "Status", "StartDate", 'EndDate', 'CreateTime']));
            await joint.uqIn(PromotionSalesRegion, _.pick(data, ["ID", "SalesRegionID"]));
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
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
            url: '^Url',
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