import { UqBus, Joint, DataPull, DataPullResult } from "uq-joint";
import { uqOutRead } from "first/converter/uqOutRead";

const faceOrderPaymentPull: DataPull<UqBus> = async (joint: Joint, uqBus: UqBus, queue: string | number): Promise<DataPullResult> => {
    let sql = `
                select top 1 ID, orderid, amount, state
                from ProdData.dbo.Export_SorderPayment_Sum
                where ID > @iMaxId order by ID
              `;
    return await uqOutRead(sql, queue);
}

export const faceOrderPayment: UqBus = {
    face: '百灵威系统工程部/SalesTask/orderpayment',
    from: 'local',
    mapper: {
        orderNo: 'orderid',
        paymentAmount: 'amount',
        state: "state",
    },
    pull: faceOrderPaymentPull
};