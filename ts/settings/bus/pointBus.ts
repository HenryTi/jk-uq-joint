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
        let sql = `select top 1 ID, SOrderID, CustomerID, CreditsID, Amount, CurrencyID, Point
            from dbs.dbo.tonvaCreditsMatched 
            where ID > @iMaxId order by ID`;
        let result = await uqOutRead(sql, queue);
        if (result !== undefined) {
            let { data } = result;
            for (let i = 0; i < data.length; i++) {
                let { SOrderID, CustomerID } = data[i];
                data[i].orderItems = [];
                let ret = await execSql(`select orderId as orderItemID, qty * unitPriceRMB * 2 as point 
                from dbs.dbo.vw_sordersbjsh where sorderid = @SOrderID and isnull(UserId, CID) = @CustomerID and Mark <> 'C'`,
                    [
                        { 'name': 'SOrderID', 'value': SOrderID },
                        { 'name': 'CustomerID', 'value': CustomerID },
                    ]);
                let { recordset } = ret;
                if (recordset.length > 0)
                    data[i].orderItems = recordset;
            }
        }
        return result;
    }
};