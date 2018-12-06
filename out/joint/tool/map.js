"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tool_1 = require("../../db/mysql/tool");
const database_1 = require("../../db/mysql/database");
async function map(moniker, id, no) {
    let sql = `
    use \`${database_1.databaseName}\`;
    create table if not exists map_${moniker} (
        id bigint not null, 
        no varchar(32) not null,
        primary key(id, no),
        unique index no_id(no, id)
    );
    
    insert into map_${moniker} (id, no) values (${id}, ${no}) 
        on duplicate key update id=${id}
    `;
    await tool_1.execSql(sql);
}
exports.map = map;
//# sourceMappingURL=map.js.map