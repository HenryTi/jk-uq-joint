import { UqBus } from "uq-joint";
import { faceOrder } from "./orderUsqBus";
import { faceProductInventory } from "./productInventoryBus";
import { facePoint } from "./pointBus";
import { faceUser, faceWebUser, faceWebUserContact, faceWebUserContacts, faceWebUserInvoice, faceWebUserCustomer, faceCustomerContractor } from "./webUserBus";
import { facePointExchange, facePointOut } from "./pointExchangeOut";
import { faceOrderPayment } from "./orderPayment";
import { faceOrderAudit } from "./orderAuditBus";
import { faceDeliveryConfirm } from "./deliveryConfirmBus";

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
    "faceOrderPayment": faceOrderPayment,
    "faceOrderAudit": faceOrderAudit,
    "faceDeliveryConfirm": faceDeliveryConfirm
};
