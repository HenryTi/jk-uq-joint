import { execSql } from "../../db/mysql/tool";
import { databaseName } from "../../db/mysql/database";

export async function map(moniker:string, id:number, no:string) {
    let sql = `
    insert into \`${databaseName}\`.map_${moniker} (id, no) values (${id}, ${no}) 
    on duplicate key update id=${id};
    `;

    await execSql(sql);
}
