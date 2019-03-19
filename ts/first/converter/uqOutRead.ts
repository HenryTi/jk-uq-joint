import { execSql } from '../../mssql/tools';

export async function uqOutRead(sql: string, maxId: string): Promise<{ lastId: string, data: any[]}> {
    // let iMaxId = maxId === "" ? 0 : Number(maxId);
    return await readMany(sql, [{ name: 'iMaxId', value: maxId }]);
}

export async function uqPullRead(sql: string, queue: number): Promise<{ queue: number, data: any }> {
    let ret = await readOne(sql, [{ name: 'iMaxId', value: queue }]);
    if (ret !== undefined)
        return { queue: Number(ret.lastId), data: ret.data };
}

const readOne = async (sqlstring: string, params?: { name: string, value: any }[]): Promise<{ lastId: string, data: any }> => {

    let result = await execSql(sqlstring, params);
    let { recordset } = result;
    if (recordset.length === 0) return;
    let prod = recordset[0];
    return { lastId: prod.ID, data: prod };
};

async function readMany(sqlstring: string, params?: { name: string, value: any }[]): Promise<{ lastId: string, data: any[] }> {

    let result = await execSql(sqlstring, params);
    let { recordset } = result;
    let rows = recordset.length;
    if (rows === 0) return;

    let prod = recordset[0];
    return { lastId: recordset[rows - 1].ID, data: recordset };
}