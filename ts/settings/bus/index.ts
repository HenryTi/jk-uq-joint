import { UqBus } from "../../uq-joint";
import { faceOrder } from "./orderUsqBus";
import { faceProductInventory } from "./productInventoryBus";
import { facePoint } from "./pointBus";
import { faceUser, faceWebUser, faceWebUserContact, faceWebUserContacts, faceWebUserInvoice } from "./webUserBus";

export const bus: { [busName: string]: UqBus } = {
    "faceOrder": faceOrder,
    "faceUser": faceUser,
    "faceWebUser": faceWebUser,
    "faceWebUserContact": faceWebUserContact,
    "faceWebUserContacts": faceWebUserContacts,
    "faceWebUserInvoice": faceWebUserInvoice,
    "facePoint": facePoint,
    "faceProductInventory": faceProductInventory,
};
