"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tools_1 = require("../../mssql/tools");
async function uqOutRead(sql, maxId) {
    let iMaxId = maxId === "" ? 0 : Number(maxId);
    return await exports.read(sql, [{ name: 'iMaxId', value: iMaxId }]);
}
exports.uqOutRead = uqOutRead;
exports.read = async (sqlstring, params) => {
    let result = await tools_1.execSql(sqlstring, params);
    let { recordset } = result;
    if (recordset.length === 0)
        return;
    let prod = recordset[0];
    return { lastId: prod.ID, data: prod };
};
//# sourceMappingURL=uqOutRead.js.map