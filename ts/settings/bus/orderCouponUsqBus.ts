import { UqBus, DataPush, Joint } from "uq-joint";
import { httpClient } from "../../tools/webApiClient";
import _ from 'lodash';

const faceOrderPush: DataPush<UqBus> = async (joint: Joint, uqBus: UqBus, queue: number, orderIn: any): Promise<boolean> => {
    let busType = orderIn.type;
    if (busType && busType !== 1 && busType !== 3) {
        // 非目标bus数据，放弃不处理
        return true;
    }
    let orderOut: any = _.pick(orderIn, ['order', 'sales']);
    try {
        await httpClient.addSaleOrderCoupon(orderOut);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export const faceOrderCoupon: UqBus = {
    face: '百灵威系统工程部/salestask/orderOwner',
    from: 'local',
    mapper: {
        order: true,
        sales: true
    },
    push: faceOrderPush
};
