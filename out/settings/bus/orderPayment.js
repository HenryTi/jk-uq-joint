"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uqOutRead_1 = require("first/converter/uqOutRead");
const faceOrderPaymentPull = async (joint, uqBus, queue) => {
    let sql = `
                select top 1 ID, orderid, amount, state
                from ProdData.dbo.Export_SorderPayment
                where ID > @iMaxId order by ID
              `;
    return await uqOutRead_1.uqOutRead(sql, queue);
};
exports.faceOrderPayment = {
    face: '百灵威系统工程部/SalesTask/orderpayment',
    from: 'local',
    mapper: {
        orderNo: 'orderid',
        paymentAmount: 'amount',
        state: "state",
    },
    pull: faceOrderPaymentPull
};
//# sourceMappingURL=orderPayment.js.map