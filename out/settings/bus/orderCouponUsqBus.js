"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.faceOrderCoupon = void 0;
const webApiClient_1 = require("../../tools/webApiClient");
const lodash_1 = __importDefault(require("lodash"));
const faceOrderPush = async (joint, uqBus, queue, orderIn) => {
    let busType = orderIn.type;
    if (busType && busType !== 1 && busType !== 3) {
        // 非目标bus数据，放弃不处理
        return true;
    }
    let orderOut = lodash_1.default.pick(orderIn, ['order', 'sales']);
    try {
        await webApiClient_1.httpClient.addSaleOrderCoupon(orderOut);
        return true;
    }
    catch (error) {
        console.error(error);
        return false;
    }
};
exports.faceOrderCoupon = {
    face: '百灵威系统工程部/salestask/orderOwner',
    from: 'local',
    mapper: {
        order: true,
        sales: true
    },
    push: faceOrderPush
};
//# sourceMappingURL=orderCouponUsqBus.js.map