import { execSql } from '../../mssql/tools';

export const read = async (sqlstring: string): Promise<{ lastId: string, data: any }> => {

    let result = await execSql(sqlstring);
    let { recordset } = result;
    if (recordset.length === 0) return;
    let prod = recordset[0];
    return { lastId: prod.ID, data: prod };
};