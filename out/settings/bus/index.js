"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bus = void 0;
const orderUsqBus_1 = require("./orderUsqBus");
const productInventoryBus_1 = require("./productInventoryBus");
const pointBus_1 = require("./pointBus");
const webUserBus_1 = require("./webUserBus");
const pointExchangeOut_1 = require("./pointExchangeOut");
const orderPayment_1 = require("./orderPayment");
const orderAuditBus_1 = require("./orderAuditBus");
const deliveryConfirmBus_1 = require("./deliveryConfirmBus");
const orderCouponUsqBus_1 = require("./orderCouponUsqBus");
const assistAchievementsBus_1 = require("./assistAchievementsBus");
const orderHistory_1 = require("./orderHistory");
const bulkInquiryBook_1 = require("./bulkInquiryBook");
const assistCustomerNowSales_1 = require("./assistCustomerNowSales");
exports.bus = {
    "faceOrder": orderUsqBus_1.faceOrder,
    "faceUser": webUserBus_1.faceUser,
    "faceWebUser": webUserBus_1.faceWebUser,
    "faceWebUserContact": webUserBus_1.faceWebUserContact,
    "faceWebUserContacts": webUserBus_1.faceWebUserContacts,
    "faceWebUserInvoice": webUserBus_1.faceWebUserInvoice,
    "faceWebUserCustomer": webUserBus_1.faceWebUserCustomer,
    "faceCustomerContractor": webUserBus_1.faceCustomerContractor,
    "faceProductInventory": productInventoryBus_1.faceProductInventory,
    "facePoint": pointBus_1.facePoint,
    "facePointExchange": pointExchangeOut_1.facePointExchange,
    "faceCreditsUsedByCustomer": pointExchangeOut_1.faceCreditsUsedByCustomer,
    "faceCreditsDrawedByCustomer": pointExchangeOut_1.faceCreditsDrawedByCustomer,
    "faceCreditsInnerMatched": pointBus_1.faceCreditsInnerMatched,
    "faceOrderPayment": orderPayment_1.faceOrderPayment,
    "faceOrderAudit": orderAuditBus_1.faceOrderAudit,
    "faceDeliveryConfirm": deliveryConfirmBus_1.faceDeliveryConfirm,
    "faceOrderCoupon": orderCouponUsqBus_1.faceOrderCoupon,
    "faceAssistAchievementsBus": assistAchievementsBus_1.faceAssistAchievementsBus,
    "faceAssistCustomerNowSales": assistCustomerNowSales_1.faceAssistCustomerNowSales,
    "faceOrderHistory": orderHistory_1.faceOrderHistory,
    "faceBulkInquiryBook": bulkInquiryBook_1.faceBulkInquiryBook,
};
//# sourceMappingURL=index.js.map