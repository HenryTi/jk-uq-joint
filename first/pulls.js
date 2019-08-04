"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqls_1 = require("./converter/sqls");
const salesRegion_1 = require("../settings/in/salesRegion");
/** */
exports.pulls = [
    { read: sqls_1.sqls.readLanguage, uqIn: salesRegion_1.Language },
];
//# sourceMappingURL=pulls.js.map