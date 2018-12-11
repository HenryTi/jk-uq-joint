import { databaseName } from "../db/mysql/database";
import { execSql } from "../db/mysql/tool";

export async function createMapTable(moniker:string):Promise<void> {
    let sql = `
    create table if not exists \`${databaseName}\`.map_${moniker} (
        id bigint not null, 
        no varchar(32) not null,
        primary key(id, no),
        unique index no_id(no, id)
    );
    `;
    await execSql(sql);
}