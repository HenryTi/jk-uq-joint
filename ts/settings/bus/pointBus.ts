import { UqBus, Joint, DataPullResult } from "uq-joint";
import { uqOutRead } from "../../first/converter/uqOutRead";
import { execSql } from "../../mssql/tools";

/**
 * 客户积分导入tonva系统所需的数据源，export_customerScoreBook来自job: 1H-把订单关联市场活动积分。
 */
export const facePoint: UqBus = {
    face: '百灵威系统工程部/pointShop/customerPoint',
    from: 'local',
    mapper: {
        customer: 'CustomerID@Customer',
        pointYear: 'Years',
        totalPoint: "AllScore",
        point: "ScoreEffective",
        usedPoint: "ScoreUsed",
    },
    pull: async (joint: Joint, uqBus: UqBus, queue: string | number): Promise<DataPullResult> => {
        let sql = `select top 1 ID, CID as CustomerID, Years, AllScore, ScoreEffective, ScoreUsed
        from ProdData.dbo.Export_CustomerScoreBook
        where ID > @iMaxId order by ID`;
        return await uqOutRead(sql, queue);
    }
};

/**
 * 内部系统订单和积分券匹配后，将匹配结果发送到tonva系统（进行积分）
 */
export const faceCreditsInnerMatched: UqBus = {
    face: '百灵威系统工程部/coupon/creditsInnerMatched',
    from: 'local',
    mapper: {
        orderId: "SOrderID",
        customer: 'CustomerID@Customer',
        webUser: 'WebUserID',
        amount: 'Amount',
        currency: "CurrencyID@Currency",
        point: "Point",
        coupon: "CreditsID",
        orderItems: {
            orderItemId: "orderItemID",
            point: true,
        }
    },
    pull: async (joint: Joint, uqBus: UqBus, queue: string | number): Promise<DataPullResult> => {
        let sql = `select top 1 ID, SOrderID, CustomerID, WebUserID, CreditsID, Amount, CurrencyID, Point
            from dbs.dbo.tonvaCreditsMatched 
            where ID > @iMaxId order by ID`;
        let result = await uqOutRead(sql, queue);
        if (result !== undefined) {
            let { data } = result;
            for (let i = 0; i < data.length; i++) {
                let { SOrderID, CustomerID, CreditsID } = data[i];
                data[i].orderItems = [];
                let ret = await execSql(`select orderItemID, point 
                from dbs.dbo.tonvaCreditsMatchedOrderItem
                where sorderid = @SOrderID and CustomerID = @CustomerID and CreditsID = @CreditsID`,
                    [
                        { 'name': 'SOrderID', 'value': SOrderID },
                        { 'name': 'CustomerID', 'value': CustomerID },
                        { 'name': 'CreditsID', 'value': CreditsID },
                    ]);
                let { recordset } = ret;
                if (recordset.length > 0)
                    data[i].orderItems = recordset;
            }
        }
        return result;
    }
};

/**
 * 积分兑换产品导入到tonva
 * 2020/11/10, ligsh, 删除，积分兑换产品转移到tonva系统中维护，不再需要从旧系统导入到tonva
export const facePointProduct: UqBus = {
    face: '百灵威系统工程部/pointShop/pointProductBus',
    from: 'local',
    mapper: {
        pack: 'PackageID@ProductX_PackX',
        description: 'Description',
        descriptionC: "DescriptionC",
        grade: "Grade",
        point: "Point",
        startDate: "StartDate",
        endDate: "EndDate",
        imageUrl: "ImageUrl",
        isValid: "IsValid",
    },
    pull: async (joint: Joint, uqBus: UqBus, queue: string | number): Promise<DataPullResult> => {
        let sql = `select top 1 p.ID, p.PackageID, j.jkid as ProductID, ps.Description, ps.DescriptionC
            , zcl_mess.dbo.fn_mi_pack_toString(j.packnr, j.quantity, j.unit, 'abstract') as Grade, p.Point, p.StartDate, p.EndDate, 1 as IsValid
            from ProdData.dbo.Export_PointProduct p
            inner join zcl_mess.dbo.jkcat j on j.jkcat = p.PackageID
            inner join zcl_mess.dbo.products ps on j.jkid = ps.jkid
            where p.ID > @iMaxId order by ID`;
        let result = await uqOutRead(sql, queue);
        if (result) {
            let { data } = result;
            if (data) {
                data.forEach(v => {
                    if (v.StartDate) v.StartDate = v.StartDate / 1000;
                    if (v.EndDate) v.EndDate = v.EndDate / 1000;
                })
            }
        }
        return result;
    }
};
*/