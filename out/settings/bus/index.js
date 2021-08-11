"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bus = void 0;
const orderChanged_1 = require("./in/order/orderChanged");
exports.bus = {
    /*
    "faceOrder": faceOrder,
    "faceUser": faceUser,
    "faceWebUser": faceWebUser,
    "faceWebUserContact": faceWebUserContact,
    "faceWebUserContacts": faceWebUserContacts,
    "faceWebUserInvoice": faceWebUserInvoice,
    "faceWebUserCustomer": faceWebUserCustomer,
    "faceCustomerContractor": faceCustomerContractor,
    "faceProductInventory": faceProductInventory,

    "facePoint": facePoint,
    "faceSignInPointOut": faceSignInPointOut,

    "facePointProductOut": facePointProductOut,
    "facePointExchange": facePointExchange,

    "faceCreditsUsedByCustomer": faceCreditsUsedByCustomer,
    "faceCreditsDrawedByCustomer": faceCreditsDrawedByCustomer,
    "faceCreditsInnerMatched": faceCreditsInnerMatched,

    "faceOrderPayment": faceOrderPayment,
    "faceOrderAudit": faceOrderAudit,
    "faceDeliveryConfirm": faceDeliveryConfirm,
    "faceOrderCoupon": faceOrderCoupon,
    "faceAssistAchievementBus": faceAssistAchievementBus,
    "faceAssistAchievementHistoryBus": faceAssistAchievementHistoryBus,
    "faceAssistCustomerNowSales": faceAssistCustomerNowSales,
    "faceOrderHistory": faceOrderHistory,
    "faceBulkInquiryBook": faceBulkInquiryBook,
*/
    "faceOrderChanged": orderChanged_1.faceOrderChanged,
    /*
        "faceOutProductChanged": faceOutProductChanged,
        "faceInnerOrderPaid": faceInnerOrderPaid,
        "faceShelfInOutBoundHistory": faceShelfInOutBoundHistory
    */
};
//# sourceMappingURL=index.js.map