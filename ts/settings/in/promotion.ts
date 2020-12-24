import * as _ from 'lodash';
import dateFormat from 'dateformat';
import { UqInTuid, UqInMap, Joint } from "uq-joint";
import { uqs } from "../uqs";
import { promotionFirstPullWrite } from '../../first/converter/promotionPullWrite';
import config from 'config';
import { UqIn } from 'uq-joint';

const promiseSize = config.get<number>("promiseSize");

export const PromotionType: UqInTuid = {
    uq: uqs.jkPromotion,
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

export const PromotionStatus: UqInTuid = {
    uq: uqs.jkPromotion,
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


export const Promotion: UqInTuid = {
    uq: uqs.jkPromotion,
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
    pullWrite: async (joint: Joint, uqin: UqIn, data: any) => {

        try {
            data["StartDate"] = data["StartDate"] && data['StartDate'].getTime() / 1000; // dateFormat(data["StartDate"], "yyyy-mm-dd HH:MM:ss");
            data["EndDate"] = data["EndDate"] && data['EndDate'].getTime() / 1000; // dateFormat(data["EndDate"], "yyyy-mm-dd HH:MM:ss");
            data["CreateTime"] = data["CreateTime"] && data['CreateTime'].getTime() / 1000; // dateFormat(data["CreateTime"], "yyyy-mm-dd HH:MM:ss");
            await joint.uqIn(Promotion, _.pick(data, ["ID", "MarketingID", "Name", "Type", "Status", "StartDate", 'EndDate', 'CreateTime']));
            // 下面这种方法是投机取巧将Map中MarkeingID为指定值的数据全部删除 - 不行，这个可能会在SalesRegion中引入无效值
            await joint.uqIn(PromotionSalesRegion, { $: '-', 'MarketingID': data['MarketingID'] });
            await joint.uqIn(PromotionSalesRegion, _.pick(data, ["MarketingID", "SalesRegionID"]));
            return true;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    firstPullWrite: promotionFirstPullWrite,
};

export const PromotionSalesRegion: UqInMap = {
    uq: uqs.jkPromotion,
    type: 'map',
    entity: 'PromotionSalesRegion',
    mapper: {
        promotion: 'MarketingID@Promotion',
        arr1: {
            salesRegion: '^SalesRegionID@SalesRegion(-1)',
        }
    }
};

export const PromotionLanguage: UqInMap = {
    uq: uqs.jkPromotion,
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

export const PromotionPackDiscount: UqInMap = {
    uq: uqs.jkPromotion,
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