import { UqBus } from "uq-joint";
import { faceOrder } from "./orderUsqBus";
import { faceProductInventory } from "./productInventoryBus";
import { facePoint } from "./pointBus";
import { faceUser, faceWebUser, faceWebUserContact, faceWebUserContacts, faceWebUserInvoice, faceWebUserCustomer, faceCustomerContractor } from "./webUserBus";
import { facePointExchange, facePointOut, faceCreditsUsedByCustomer, faceCreditsDrawedByCustomer } from "./pointExchangeOut";
import { faceOrderPayment } from "./orderPayment";
import { faceOrderAudit } from "./orderAuditBus";
import { faceDeliveryConfirm } from "./deliveryConfirmBus";
import { faceOrderCoupon } from "./orderCouponUsqBus";
import { faceAssistAchievementsBus } from "./assistAchievementsBus";
import { faceOrderHistory } from "./orderHistory";
import { faceBulkInquiryBook } from "./bulkInquiryBook";

export const bus: { [busName: string]: UqBus } = {
    "faceOrder": faceOrder,
    "faceUser": faceUser,
    "faceWebUser": faceWebUser,
    "faceWebUserContact": faceWebUserContact,
    "faceWebUserContacts": faceWebUserContacts,
    "faceWebUserInvoice": faceWebUserInvoice,
    "faceWebUserCustomer": faceWebUserCustomer,
    "faceCustomerContractor": faceCustomerContractor,
    "facePoint": facePoint,
    "faceProductInventory": faceProductInventory,
    "facePointExchange": facePointExchange,
    "facePointOut": facePointOut,
    "faceCreditsUsedByCustomer": faceCreditsUsedByCustomer,
    "faceCreditsDrawedByCustomer": faceCreditsDrawedByCustomer,
    "faceOrderPayment": faceOrderPayment,
    "faceOrderAudit": faceOrderAudit,
    "faceDeliveryConfirm": faceDeliveryConfirm,
    "faceOrderCoupon": faceOrderCoupon,
    "faceAssistAchievementsBus": faceAssistAchievementsBus,
    "faceOrderHistory": faceOrderHistory,
    "faceBulkInquiryBook": faceBulkInquiryBook,
};
