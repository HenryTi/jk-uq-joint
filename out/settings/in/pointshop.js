"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dateformat_1 = __importDefault(require("dateformat"));
const config_1 = __importDefault(require("config"));
const uqs_1 = require("../uqs");
const uqOutRead_1 = require("../../first/converter/uqOutRead");
const promiseSize = config_1.default.get("promiseSize");
exports.PointProduct = {
    uq: uqs_1.uqs.jkPointShop,
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
    pullWrite: async (joint, data) => {
        data["StartDate"] = data["StartDate"] && dateformat_1.default(data["StartDate"], "yyyy-mm-dd HH:MM:ss");
        data["EndDate"] = data["EndDate"] && dateformat_1.default(data["EndDate"], "yyyy-mm-dd HH:MM:ss");
        await joint.uqIn(exports.PointProduct, data);
        return true;
    }
};
exports.PlatformOrder = {
    uq: uqs_1.uqs.jkPointShop,
    type: 'map',
    entity: 'PlatformOrder',
    mapper: {
        orderItemId: 'OrderItemID',
        orderId: 'OrderID',
        customer: "CustomerID@BuyerAccount",
        orderMaker: 'OrderMaker@Customer',
        platformOrderId: 'PlatformOrderID',
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
    },
    pull: async (joint, uqIn, queue) => {
        let step_seconds = 10 * 60;
        if ((queue - 8 * 60 * 60 + step_seconds) * 1000 > Date.now())
            return undefined;
        let nextQueue = queue + step_seconds;
        let sql = `select DATEDIFF(s, '1970-01-01', p.RecordTime) + 1 as ID, p.orderid as OrderItemID, p.SorderID as OrderID, p.CID as CustomerID
           , p.WorkingColumn2 as PlatformOrderID, p.Description, p.DescriptionC, p.PackNo, p.Packing, p.Unit, p.Qty, p.UnitPriceRMB as Price
           , p.Qty * p.UnitPriceRMB as SubAmount, p.UnitPriceRMBCurrency as CurrencyID, p.Mark, p.UserID as OrderMaker
           from dbs.dbo.vw_SOrdersBJSH p
           where p.RecordTime >= DATEADD(s, @iMaxId, '1970-01-01') and p.RecordTime <= DATEADD(s, ${nextQueue}, '1970-01-01')
           and p.WorkingColumn2 is not null and p.userid is not null
           order by p.RecordTime`;
        try {
            let ret = await uqOutRead_1.uqOutRead(sql, queue);
            if (ret === undefined) {
                ret = { lastPointer: nextQueue, data: [] };
            }
            return ret;
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
};
//# sourceMappingURL=pointshop.js.map