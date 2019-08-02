import { UqBus } from "../../uq-joint";
import { faceOrder } from "./orderUsqBus";
import { faceProductInventory } from "./productInventoryBus";
import { facePoint } from "./pointBus";

export const bus: UqBus[] = [
    faceOrder,
    /*
    facePoint,
    faceProductInventory,
    */
];
