"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.faceInnerOrderPaied = exports.faceOrderPayment = void 0;
const uqOutRead_1 = require("../../first/converter/uqOutRead");
/**
 * 用于将付款结果导入到tonva系统（计算轻代理到账提成）——TODO:将被faceOrderPaied替换
 */
exports.faceOrderPayment = {
    face: '百灵威系统工程部/SalesTask/orderpayment',
    from: 'local',
    mapper: {
        orderNo: 'orderid',
        paymentAmount: 'amount',
        state: "state",
    },
    pull: async (joint, uqBus, queue) => {
        // Export_SOrderPayment_Sum在job：""中通过调用ProdData.dbo.lp_computeSorderPayment更新
        let sql = `select top 1 ID, orderid, amount, state
                from ProdData.dbo.Export_SorderPayment_Sum
                where ID > @iMaxId order by ID
              `;
        return await uqOutRead_1.uqOutRead(sql, queue);
    }
};
/**
 *
 */
exports.faceInnerOrderPaied = {
    face: '百灵威系统工程部/FiReceivable/innerOrderPaied',
    from: 'local',
    mapper: {
        orderItemId: 'orderItemId',
        orderId: 'orderId',
        amount: 'amount',
        currency: 'currencyId@Currency',
        action: true,
        createDate: true,
    },
    pull: async (joint, uqBus, queue) => {
        let sql = `select top 1 ID, orderId, ordertemId as orderItemId, amount, 'RMB' as currencyId, state as action, createDate
            from  ProdData.dbo.Export_SOrderPayment
            where  ID > @iMaxId order by ID`;
        return await uqOutRead_1.uqOutRead(sql, queue);
    }
};
//# sourceMappingURL=orderPayment.js.map