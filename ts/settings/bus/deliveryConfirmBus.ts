import { UqBus, DataPull, DataPush, Joint, DataPullResult } from "uq-joint";
//import { UqBus, DataPull, DataPush, Joint, DataPullResult } from "../../uq-joint";
import { uqPullRead, uqOutRead } from "../../first/converter/uqOutRead";

const deliveryConfirmPull: DataPull<UqBus> = async (joint: Joint, uqBus: UqBus, queue: string | number): Promise<DataPullResult> => {
    // console.log(orderIn);
    let sql = `SELECT  TOP 1 ID, outBoundItemId, outBoundId, warehouseName, logisticsCompanyId, logisticsNumber, deliveryGoodsTime, deliveryAddress, 
        saleOrderId, saleOrderItemId, packageId, quantity, operatorId, operatorName, operatorPhone, customerId
        FROM	ProdData.dbo.Export_deliveryConfirm
        WHERE	ID > @iMaxId order by ID`;
    return await uqOutRead(sql, queue);
}

export const faceDeliveryConfirm: UqBus = {
    face: '百灵威系统工程部/Adapter/deliveryConfirm',
    from: 'local',
    mapper: {
        outBoundItemId: 'outBoundItemId',
        outBoundId: 'outBoundId',
        warehouseName: 'warehouseName',
        logisticsCompanyId: 'logisticsCompanyId@ExpressLogistics',
        logisticsNumber: 'logisticsNumber',
        deliveryGoodsTime: 'deliveryGoodsTime',
        deliveryAddress: 'deliveryAddress',
        saleOrderId: 'saleOrderId',
        saleOrderItemId: 'saleOrderItemId',
        packageId: 'packageId',
        quantity: 'quantity',
        operatorId: 'operatorId',
        operatorName: 'operatorName',
        operatorPhone: 'operatorPhone',
        customerId: 'customerId'
    },
    pull: deliveryConfirmPull
};