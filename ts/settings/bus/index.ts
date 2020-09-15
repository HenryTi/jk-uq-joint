import { UqBus } from "uq-joint";
import { faceOrder } from "./orderUsqBus";
import { faceProductInventory } from "./productInventoryBus";
import { facePoint, faceCreditsInnerMatched } from "./pointBus";
import { faceUser, faceWebUser, faceWebUserContact, faceWebUserContacts, faceWebUserInvoice, faceWebUserCustomer, faceCustomerContractor } from "./webUserBus";
import { facePointExchange, facePointOut, faceCreditsUsedByCustomer, faceCreditsDrawedByCustomer } from "./pointExchangeOut";
import { faceOrderPayment } from "./orderPayment";
import { faceOrderAudit } from "./orderAuditBus";
import { faceDeliveryConfirm } from "./deliveryConfirmBus";
import { faceOrderCoupon } from "./orderCouponUsqBus";
import { faceAssistAchievementBus, faceAssistAchievementDetailBus } from "./assistAchievementsBus";
import { faceOrderHistory } from "./orderHistory";
import { faceBulkInquiryBook } from "./bulkInquiryBook";
import { faceAssistCustomerNowSales } from "./assistCustomerNowSales";

export const bus: { [busName: string]: UqBus } = {
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
    "facePointExchange": facePointExchange,
    "facePointOut": facePointOut,
    "faceCreditsUsedByCustomer": faceCreditsUsedByCustomer,
    "faceCreditsDrawedByCustomer": faceCreditsDrawedByCustomer,
    "faceCreditsInnerMatched": faceCreditsInnerMatched,

    "faceOrderPayment": faceOrderPayment,
    "faceOrderAudit": faceOrderAudit,
    "faceDeliveryConfirm": faceDeliveryConfirm,
    "faceOrderCoupon": faceOrderCoupon,
    "faceAssistAchievementBus": faceAssistAchievementBus,
    "faceAssistAchievementDetailBus": faceAssistAchievementDetailBus,
    "faceAssistCustomerNowSales": faceAssistCustomerNowSales,
    "faceOrderHistory": faceOrderHistory,
    "faceBulkInquiryBook": faceBulkInquiryBook,
};
