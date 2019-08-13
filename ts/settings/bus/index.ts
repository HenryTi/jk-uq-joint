import { UqBus } from "../../uq-joint";
import { faceOrder } from "./orderUsqBus";
import { faceProductInventory } from "./productInventoryBus";
import { facePoint } from "./pointBus";
import { faceUser } from "./webUserBus";

export const bus: UqBus[] = [
    // faceOrder,
    faceUser,
    /*
    facePoint,
    faceProductInventory,
    */
];
