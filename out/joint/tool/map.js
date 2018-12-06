"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tool_1 = require("../../db/mysql/tool");
const database_1 = require("../../db/mysql/database");
async function map(moniker, id, no) {
    let sql = `
    insert into \`${database_1.databaseName}\`.map_${moniker} (id, no) values (${id}, ${no}) 
    on duplicate key update id=${id};
    `;
    await tool_1.execSql(sql);
}
exports.map = map;
//# sourceMappingURL=map.js.map