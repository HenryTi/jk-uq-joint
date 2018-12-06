import { inputs } from "../inputs";
import { usqs } from "../usqs";
import { databaseName } from "../../db/mysql/database";
import { execSql } from "../../db/mysql/tool";

export async function createMapTables() {
    for (let i in inputs) await createMapTable(i);
    for (let i in usqs) await createMapTable(i);
}

async function createMapTable(moniker:string):Promise<void> {
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