"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackTypePullWrite = void 0;
const lodash_1 = __importDefault(require("lodash"));
const salesRegion_1 = require("../../settings/in/salesRegion");
async function PackTypePullWrite(joint, data) {
    try {
        await joint.uqIn(salesRegion_1.PackType, lodash_1.default.pick(data, ["ID", "UnitE", "UnitC"]));
        await joint.uqIn(salesRegion_1.PackTypeMapToStandard, lodash_1.default.pick(data, ["ID", "StandardUnitID"]));
        return true;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
exports.PackTypePullWrite = PackTypePullWrite;
//# sourceMappingURL=commonPullWrite.js.map