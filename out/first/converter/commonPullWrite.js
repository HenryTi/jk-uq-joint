"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = __importStar(require("lodash"));
const salesRegion_1 = require("../../settings/in/salesRegion");
async function PackTypePullWrite(joint, data) {
    try {
        await joint.usqIn(salesRegion_1.PackType, _.pick(data, ["ID", "UnitE", "UnitC"]));
        await joint.usqIn(salesRegion_1.PackTypeMapToStandard, _.pick(data, ["ID", "StandardUnitID"]));
    }
    catch (error) {
        console.error(error);
    }
}
exports.PackTypePullWrite = PackTypePullWrite;
//# sourceMappingURL=commonPullWrite.js.map