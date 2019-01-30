"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tools_1 = require("../../mssql/tools");
exports.read = async (sqlstring) => {
    let result = await tools_1.execSql(sqlstring);
    let { recordset } = result;
    if (recordset.length === 0)
        return;
    let prod = recordset[0];
    return { lastId: prod.ID, data: prod };
};
//# sourceMappingURL=index.js.map