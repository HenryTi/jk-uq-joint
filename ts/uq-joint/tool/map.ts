import { execSql } from "../db/mysql/tool";
import { databaseName } from "../db/mysql/database";
import { createMapTable } from "./createMapTable";

export async function map(moniker: string, id: number, no: string) {
    moniker = moniker.toLowerCase();
    let sql = `
        insert into \`${databaseName}\`.\`map_${moniker}\` (id, no) values (${id}, '${no}')
        on duplicate key update id=${id};
    `;

    try {
        await execSql(sql);
    }
    catch (err) {
        await createMapTable(moniker);
        await execSql(sql);
    }
}
