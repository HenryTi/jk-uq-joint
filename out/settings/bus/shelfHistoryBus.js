"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.faceShelfInOutBoundHistory = void 0;
//import { UqBus, DataPull, DataPush, Joint, DataPullResult } from "../../uq-joint";
const uqOutRead_1 = require("../../first/converter/uqOutRead");
const config_1 = __importDefault(require("config"));
const interval = config_1.default.get("interval");
const orderAuditPull = async (joint, uqBus, queue) => {
    // console.log(orderIn);
    let step_seconds = Math.max(interval * 10 / 1000, 300);
    if ((queue - 8 * 60 * 60 + step_seconds) * 1000 > Date.now())
        return undefined;
    let nextQueue = queue + step_seconds;
    let sql = ` SELECT  TOP 1 DATEDIFF(s, '1970-01-01', update__time) + 1 as ID, s.OIStockHJHID, StockArea, KFKQDM, KFKQFJH, HJZDM, HJZFCDM, HWH, 
                        oi.Jkcat, oi.jkid, s.LotNr, s.OIMark, Qty, InputTime, update__time
                FROM    dbs.dbo.ShelfNumOIStock s
                        INNER JOIN dbs.dbo.OIstorage oi ON oi.OIStorageID = s.OIStorageID
                WHERE	update__time >= DATEADD(s, @iMaxId, '1970-01-01')
                        AND update__time <= DATEADD(s, ${nextQueue}, '1970-01-01')
                ORDER BY update__time `;
    return await uqOutRead_1.uqOutRead(sql, queue);
};
const shelfHistoryPush = async (joint, uqBus, queue, shelfHistory) => {
    let result;
    try {
        console.log('货架出入库数据处理...');
        console.log(shelfHistory);
        return result;
    }
    catch (error) {
        console.error(error);
        return false;
    }
};
exports.faceShelfInOutBoundHistory = {
    face: '百灵威系统工程部/Adapter/shelfInOutBoundHistory',
    from: 'local',
    mapper: {
        ID: 'ID',
        Warehouse: 'StockArea@Warehouse',
        WarehouseBuilding: 'KFKQDM@WarehouseBuild',
        WarehouseRoom: 'KFKQFJH@WarehouseRoom',
        Shelf: 'HJZDM@Shelf',
        ShelfLayer: 'HJZFCDM@ShelfLayer',
        ShelfBlock: 'HWH@ShelfBlock',
        ProductX: 'jkid@ProductX',
        PackX: 'Jkcat@ProductX_PackX',
        lotNumber: 'LotNr',
        InOutType: 'OIMark',
        quantity: 'Qty',
        inBoundDate: 'InputTime'
    },
    pull: orderAuditPull,
    push: shelfHistoryPush
};
//# sourceMappingURL=shelfHistoryBus.js.map