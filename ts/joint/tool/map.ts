import { execSql } from "../../db/mysql/tool";
import { databaseName } from "../../db/mysql/database";

export async function map(moniker:string, id:number, no:string) {
    let sql = `
    use \`${databaseName}\`;
    create table if not exists map_${moniker} (
        id bigint not null, 
        no varchar(32) not null,
        primary key(id, no),
        unique index no_id(no, id)
    );
    
    insert into map_${moniker} (id, no) values (${id}, ${no}) 
        on duplicate key update id=${id}
    `;

    await execSql(sql);
}
