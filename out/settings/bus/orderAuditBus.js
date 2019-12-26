"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import { UqBus, DataPull, DataPush, Joint, DataPullResult } from "../../uq-joint";
const uqOutRead_1 = require("../../first/converter/uqOutRead");
const orderAuditPull = async (joint, uqBus, queue) => {
    // console.log(orderIn);
    let sql = `SELECT TOP 1 ID, saleOrderId, saleOrderItemId, packageId, quantity, customerId, result, reason
        FROM	ProdData.dbo.Export_OrderAuditResult
        WHERE	ID > @iMaxId order by ID`;
    return await uqOutRead_1.uqOutRead(sql, queue);
};
exports.faceOrderAudit = {
    face: '百灵威系统工程部/Adapter/orderAudit',
    from: 'local',
    mapper: {
        saleOrderId: 'saleOrderId',
        saleOrderItemId: 'saleOrderItemId',
        packageId: 'packageId',
        quantity: 'quantity',
        customerId: 'customerId',
        result: 'result',
        reason: 'reason'
    },
    pull: orderAuditPull
};
//# sourceMappingURL=orderAuditBus.js.map