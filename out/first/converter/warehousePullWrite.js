"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShelfLayerPullWrite = exports.ShelfPullWrite = exports.WarehouseRoomPullWrite = void 0;
//import { Joint, MapUserToUq, UqIn } from "../../uq-joint";
const lodash_1 = __importDefault(require("lodash"));
const warehouse_1 = require("../../settings/in/warehouse");
async function WarehouseRoomPullWrite(joint, uqIn, data) {
    try {
        await joint.uqIn(warehouse_1.WarehouseRoom, lodash_1.default.pick(data, ["ID", "WarehouseRoomID", "WarehouseRoomName", "WarehouseID", "isValid"]));
        return true;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
exports.WarehouseRoomPullWrite = WarehouseRoomPullWrite;
async function ShelfPullWrite(joint, uqIn, data) {
    try {
        await joint.uqIn(warehouse_1.Shelf, lodash_1.default.pick(data, ["ID", "ShelfID", "ShelfName", "WarehouseRoomID", "isValid"]));
        return true;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
exports.ShelfPullWrite = ShelfPullWrite;
async function ShelfLayerPullWrite(joint, uqIn, data) {
    try {
        await joint.uqIn(warehouse_1.ShelfLayer, lodash_1.default.pick(data, ["ID", "ShelfLayerID", "ShelfLayerName", "ShelfID", "isValid"]));
        return true;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
exports.ShelfLayerPullWrite = ShelfLayerPullWrite;
//# sourceMappingURL=warehousePullWrite.js.map