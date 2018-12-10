"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tool_1 = require("../../db/mysql/tool");
const database_1 = require("../../db/mysql/database");
const createMapTable_1 = require("./createMapTable");
async function map(moniker, id, no) {
    let sql = `
        insert into \`${database_1.databaseName}\`.map_${moniker} (id, no) values (${id}, '${no}') 
        on duplicate key update id=${id};
    `;
    try {
        await tool_1.execSql(sql);
    }
    catch (err) {
        await createMapTable_1.createMapTable(moniker);
        await tool_1.execSql(sql);
    }
}
exports.map = map;
//# sourceMappingURL=map.js.map