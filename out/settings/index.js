"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const in_1 = __importDefault(require("./in"));
const out_1 = __importDefault(require("./out"));
const pull_1 = __importDefault(require("./pull"));
//import push from "./push";
exports.settings = {
    unit: 24,
    allowedIP: [
        '218.249.142.140',
        '211.5.7.60'
    ],
    in: in_1.default,
    out: out_1.default,
    pull: pull_1.default,
};
//# sourceMappingURL=index.js.map