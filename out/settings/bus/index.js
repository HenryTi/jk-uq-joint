"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const orderUsqBus_1 = require("./orderUsqBus");
const productInventoryBus_1 = require("./productInventoryBus");
const pointBus_1 = require("./pointBus");
const webUserBus_1 = require("./webUserBus");
exports.bus = {
    "faceOrder": orderUsqBus_1.faceOrder,
    "faceUser": webUserBus_1.faceUser,
    "faceWebUser": webUserBus_1.faceWebUser,
    "faceWebUserContact": webUserBus_1.faceWebUserContact,
    "faceWebUserContacts": webUserBus_1.faceWebUserContacts,
    "faceWebUserInvoice": webUserBus_1.faceWebUserInvoice,
    "facePoint": pointBus_1.facePoint,
    "faceProductInventory": productInventoryBus_1.faceProductInventory,
};
//# sourceMappingURL=index.js.map