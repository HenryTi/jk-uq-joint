"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("config"));
const promiseSize = config_1.default.get("promiseSize");
/**
 * TODO: 积分产品导入到tonva系统
export const PointProduct: UqInMap = {
    uq: uqs.jkPointShop,
    type: 'map',
    entity: 'PointProduct',
    mapper: {
        product: "ProductID@ProductX",
        arr1: {
            pack: "^PackageID@ProductX_PackX",
            point: "^Point",
            startDate: "^StartDate",
            endDate: "^EndDate"
        }
    },
    // Export_PointProduct中的数据通过dbs.dbo.MGift上的Trigger写入，起开始时间结束时间为活动A08-20160422A的开始时间和结束时间
    pull: `select top ${promiseSize} p.ID, p.PackageID, j.jkid as ProductID, p.Point, p.StartDate, p.EndDate, p.Comments
    from ProdData.dbo.Export_PointProduct p
    inner join zcl_mess.dbo.jkcat j on j.jkcat = p.PackageID where p.ID > @iMaxId order by ID`,
    pullWrite: async (joint: Joint, uqIn: UqIn, data: any) => {
        data["StartDate"] = data["StartDate"] && dateFormat(data["StartDate"], "yyyy-mm-dd HH:MM:ss");
        data["EndDate"] = data["EndDate"] && dateFormat(data["EndDate"], "yyyy-mm-dd HH:MM:ss");
        await joint.uqIn(PointProduct, data);
        return true;
    }
}
*/
/**
 * 删除 —— 订单导入PointShop，用来进行积分券匹配
export const PointShopOrder: UqInMap = {
    uq: uqs.jkPointShop,
    type: 'map',
    entity: 'PointShopOrder',
    mapper: {
        orderItemId: 'OrderItemID',
        orderId: 'OrderID',
        customer: "CustomerID@BuyerAccount",
        orderMaker: 'OrderMaker@Customer',
        description: 'Description',
        descriptionC: 'DescriptionC',
        radiox: 'PackNo',
        radioy: 'Packing',
        unit: 'Unit',
        quantity: 'Qty',
        price: 'Price',
        subAmount: 'SubAmount',
        currency: "CurrencyID@Currency",
        mark: 'Mark',
        createDate: 'RecordTime',
    },
    pull: async (joint: Joint, uqIn: UqInMap, queue: number): Promise<DataPullResult> => {
        let step_seconds = 10 * 60;
        if ((queue - 8 * 60 * 60 + step_seconds) * 1000 > Date.now())
            return undefined;
        let nextQueue = queue + step_seconds;
        let sql = `
            select DATEDIFF(s, '1970-01-01', p.RecordTime) + 1 as ID, p.orderid as OrderItemID, p.SorderID as OrderID, p.CID as CustomerID
                    , p.Description, p.DescriptionC, p.PackNo, p.Packing, p.PUnit as Unit, p.Qty, p.UnitPriceRMB as Price
                    , p.Qty * p.UnitPriceRMB as SubAmount, p.UnitPriceRMBCurrency as CurrencyID, p.Mark, isnull(p.UserID, p.cid) as OrderMaker, p.RecordTime
            from dbs.dbo.vw_SOrdersBJSH p
            where p.RecordTime >= DATEADD(s, @iMaxId, '1970-01-01') and p.RecordTime <= DATEADD(s, ${nextQueue}, '1970-01-01')
            order by p.RecordTime
           `;
        try {
            let ret = await uqOutRead(sql, queue);
            if (ret === undefined) {
                ret = { lastPointer: nextQueue, data: [] };
            }
            return ret;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

export const WebUserPointDiff: UqInMap = {
    uq: uqs.jkPointShop,
    type: 'map',
    entity: 'WebUserPointDiff',
    mapper: {
        webuser: true,
        customerId: true,
        pointyear: true,
        totalpoint: true,
        point: true,
        usedpoint: true,
    },
    pull: async (joint: Joint, uqin: UqInMap, queue: number) => {
        let currentWebUser: number;
        let getQueue = `select webuser from pointshop.tv_pointbook where webuser > ${queue} and pointyear > 2017 limit 1`;
        let queueResult = await execSql(getQueue);
        if (queueResult.length === 1) {
            currentWebUser = queueResult[0].webuser;
        }
        let sql = `select   a.webuser, c.no as customerId, a.pointyear, a.totalpoint, a.point, a.usedpoint
                   from     pointshop.tv_pointbook as a
                            left join webuser.tv_webusercustomer as wc on wc.webuser = a.webuser
                            left join customer.tv_customer as c on c.$unit = wc.$unit and c.id = wc.customer
                    where   a.webuser = ? and a.pointyear > 2017`;
        let result = await execSql(sql, [currentWebUser]);
        if (result.length > 0) {
            let { webuser, customerId } = result[0];
            let data = [{ webuser, customerId, points: [] }];
            result.forEach((e: any) => {
                data[0].points.push({ pointyear: e.pointyear, totalpoint: e.totalpoint, point: e.point, usedpoint: e.usedpoint });
            });
            return { lastPointer: currentWebUser, data: data };
        }
    },
    pullWrite: async (joint: Joint, uqin: UqInMap, data: any) => {

        let { webuser, customerId, points } = data;
        let sql = `select   cid as customerId, Years as pointyear, allScore as totalpoint, scoreEffective as point, ScoreUsed as usedpoint
                   from     dbs.dbo.CustomerScoreBook
                   where    cid = @customerId and years > 2017`;
        let result = await msExecSql(sql, [{ "name": "customerId", "value": customerId }]);
        let { rowsAffected, recordset } = result;
        let diff = { webuser, customerId, diffs: [] };

        points.forEach(p => {
            let { pointyear, totalpoint, point, usedpoint } = p;
            let cp = recordset.find(cp => cp.pointyear === pointyear);
            if (cp !== undefined) {
                let { totalpoint: ctotalpoint, point: cpoint, usedpoint: cusedpoint } = cp;
                if (Math.abs(ctotalpoint - totalpoint) > 1 || Math.abs(cpoint - point) > 1 || Math.abs(cusedpoint - usedpoint) > 1) {
                    diff.diffs.push({
                        pointyear, ctotalpoint: ctotalpoint, cpoint: cpoint, cusedpoint: cusedpoint,
                        totalpoint: totalpoint, point: point, usedpoint: usedpoint
                    });
                }
            } else {
                diff.diffs.push({
                    pointyear, ctotalpoint: undefined, cpoint: undefined, cusedpoint: undefined,
                    totalpoint: totalpoint, point: point, usedpoint: usedpoint
                });
            }
        });

        recordset.forEach(cp => {
            let { pointyear: cpointyear, totalpoint: ctotalpoint, point: cpoint, usedpoint: cusedpoint } = cp;
            let p = points.find(p => p.pointyear === cpointyear);
            if (p !== undefined) {
                let { totalpoint, point, usedpoint } = cp;
                if (Math.abs(ctotalpoint - totalpoint) > 1 || Math.abs(cpoint - point) > 1 || Math.abs(cusedpoint - usedpoint) > 1) {
                    if (!diff.diffs.find(x => x.pointyear === cpointyear))
                        diff.diffs.push({
                            pointyear: cpointyear, ctotalpoint: ctotalpoint, cpoint: cpoint, cusedpoint: cusedpoint,
                            totalpoint: totalpoint, point: point, usedpoint: usedpoint
                        });
                }
            } else {
                diff.diffs.push({
                    pointyear: cpointyear, ctotalpoint: cpointyear, cpoint: cpoint, cusedpoint: cusedpoint,
                    totalpoint: undefined, point: undefined, usedpoint: undefined
                });
            }
        });

        if (diff.diffs.length > 0) {
            let isql = "insert into dbs.dbo.CustomerScoreBookDiff(webuser, customerId, diff) values(@webuser, @customerId, @diff)";
            await msExecSql(isql, [
                { name: "webuser", value: webuser },
                { name: "customerId", value: customerId },
                { name: "diff", value: JSON.stringify(diff.diffs) }
            ]);
        }
        return true;
    }
}
*/ 
//# sourceMappingURL=pointshop.js.map