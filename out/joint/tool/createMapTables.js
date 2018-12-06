"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inputs_1 = require("../inputs");
const usqs_1 = require("../usqs");
const database_1 = require("../../db/mysql/database");
const tool_1 = require("../../db/mysql/tool");
async function createMapTables() {
    for (let i in inputs_1.inputs)
        await createMapTable(i);
    for (let i in usqs_1.usqs)
        await createMapTable(i);
}
exports.createMapTables = createMapTables;
async function createMapTable(moniker) {
    let sql = `
    create table if not exists \`${database_1.databaseName}\`.map_${moniker} (
        id bigint not null, 
        no varchar(32) not null,
        primary key(id, no),
        unique index no_id(no, id)
    );
    `;
    await tool_1.execSql(sql);
}
//# sourceMappingURL=createMapTables.js.map