import { UqBus } from "../../uq-joint";
import { faceOrder } from "./orderUsqBus";
import { faceProductInventory } from "./productInventoryBus";
import { facePoint } from "./pointBus";
import { faceUser, faceWebUser, faceWebUserContact, faceWebUserContacts, faceWebUserInvoice } from "./webUserBus";

export const bus: UqBus[] = [
    // faceOrder,
    faceUser,
    faceWebUser,
    faceWebUserContact,
    faceWebUserContacts,
    faceWebUserInvoice,
    /*
    facePoint,
    faceProductInventory,
    */
];
