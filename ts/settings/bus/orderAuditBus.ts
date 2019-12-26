import { UqBus, DataPull, DataPush, Joint, DataPullResult } from "uq-joint";
//import { UqBus, DataPull, DataPush, Joint, DataPullResult } from "../../uq-joint";
import { uqPullRead, uqOutRead } from "../../first/converter/uqOutRead";

const orderAuditPull: DataPull<UqBus> = async (joint: Joint, uqBus: UqBus, queue: string | number): Promise<DataPullResult> => {
    // console.log(orderIn);
    let sql = `SELECT TOP 1 ID, saleOrderId, saleOrderItemId, packageId, quantity, customerId, result, reason
        FROM	ProdData.dbo.Export_OrderAuditResult
        WHERE	ID > @iMaxId order by ID`;
    return await uqOutRead(sql, queue);
}

export const faceOrderAudit: UqBus = {
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