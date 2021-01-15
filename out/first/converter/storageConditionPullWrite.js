"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageConditionPullWrite = void 0;
const lodash_1 = __importDefault(require("lodash"));
const chemical_1 = require("../../settings/in/chemical");
async function StorageConditionPullWrite(joint, uqIn, data) {
    try {
        await joint.uqIn(chemical_1.StorageCondition, lodash_1.default.pick(data, ["ID", "CodeST", "DescriptionST"]));
        return true;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
exports.StorageConditionPullWrite = StorageConditionPullWrite;
//# sourceMappingURL=storageConditionPullWrite.js.map