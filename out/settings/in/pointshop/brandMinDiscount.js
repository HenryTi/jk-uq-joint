"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandMinDiscount = void 0;
const config_1 = __importDefault(require("config"));
const uqs_1 = require("settings/uqs");
const promiseSize = config_1.default.get("promiseSize");
exports.BrandMinDiscount = {
    uq: uqs_1.uqs.jkPointShop,
    type: 'map',
    entity: 'BrandMinDiscount',
    mapper: {
        brand: 'MCode@Brand',
        discount: 'Discount',
        isValid: 'Active',
    },
};
//# sourceMappingURL=brandMinDiscount.js.map