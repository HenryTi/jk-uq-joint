import { UqBus } from "uq-joint";
import { faceOrder } from "./orderUsqBus";
import { faceProductInventory } from "./productInventoryBus";
import { facePoint, faceCreditsInnerMatched, facePointProduct } from "./pointBus";
import { faceUser, faceWebUser, faceWebUserContact, faceWebUserContacts, faceWebUserInvoice, faceWebUserCustomer, faceCustomerContractor } from "./webUserBus";
import { facePointExchange, faceCreditsUsedByCustomer, faceCreditsDrawedByCustomer, faceSignInPointOut } from "./pointExchangeOut";
import { faceOrderPayment } from "./orderPayment";
import { faceOrderAudit } from "./orderAuditBus";
import { faceDeliveryConfirm } from "./deliveryConfirmBus";
import { faceOrderCoupon } from "./orderCouponUsqBus";
import { faceAssistAchievementBus, faceAssistAchievementHistoryBus } from "./assistAchievementsBus";
import { faceOrderHistory } from "./orderHistory";
import { faceBulkInquiryBook } from "./bulkInquiryBook";
import { faceAssistCustomerNowSales } from "./assistCustomerNowSales";
import { facePointProductOut } from "./out/pointProductOut";

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
    "faceSignInPointOut": faceSignInPointOut,

    "facePointProduct": facePointProduct,
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
};
