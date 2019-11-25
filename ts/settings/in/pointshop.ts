import { UqInTuid, UqInMap, Joint, DataPullResult } from "uq-joint";
import dateFormat from 'dateformat';
import config from 'config';
import { uqs } from "../uqs";
import { uqOutRead } from "../../first/converter/uqOutRead";

const promiseSize = config.get<number>("promiseSize");

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
    pull: `select top ${promiseSize} p.ID, p.PackageID, j.jkid as ProductID, p.Point, p.StartDate, p.EndDate, p.Comments from ProdData.dbo.Export_PointProduct p
    inner join zcl_mess.dbo.jkcat j on j.jkcat = p.PackageID where p.ID > @iMaxId order by ID`,
    pullWrite: async (joint: Joint, data: any) => {
        data["StartDate"] = data["StartDate"] && dateFormat(data["StartDate"], "yyyy-mm-dd HH:MM:ss");
        data["EndDate"] = data["EndDate"] && dateFormat(data["EndDate"], "yyyy-mm-dd HH:MM:ss");
        await joint.uqIn(PointProduct, data);
        return true;
    }
}

export const PlatformOrder: UqInMap = {
    uq: uqs.jkPointShop,
    type: 'map',
    entity: 'PlatformOrder',
    mapper: {
        orderItemId: 'OrderItemID',
        orderId: 'OrderID',
        customer: "CustomerID@Customer",
        platformOrderId: 'PlatformOrderID',
        subAmount: 'SubAmount',
        currency: "CurrencyID@Currency"
    },
    pull: async (joint: Joint, uqIn: UqInMap, queue: number): Promise<DataPullResult> => {
        let step_seconds = 10 * 60;
        if ((queue - 8 * 60 * 60 + step_seconds) * 1000 > Date.now())
            return undefined;
        let nextQueue = queue + step_seconds;
        let sql = `select DATEDIFF(s, '1970-01-01', p.RecordTime) + 1 as ID, p.orderid as OrderItemID, p.SorderID as OrderID, p.CID as CustomerID
           , p.WorkingColumn2 as PlatformOrderID, p.Qty * p.UnitPriceRMB as SubAmount, p.UnitPriceRMBCurrency as CurrencyID
           from dbs.dbo.vw_SOrdersBJSH p
           where p.RecordTime >= DATEADD(s, @iMaxId, '1970-01-01') and p.RecordTime <= DATEADD(s, ${nextQueue}, '1970-01-01')
           and p.WorkingColumn2 is not null
           order by p.RecordTime`;
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
