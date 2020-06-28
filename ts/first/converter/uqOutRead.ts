import { DataPullResult } from 'uq-joint';
import { execSql } from '../../mssql/tools';

/**
 * 按照时间范围读取要导出的数据（仅适用时间是分散发布的情况）
 * @param sql
 * @param queue
 * @param interval
 */
export async function uqOutReadTimeScope(sql: string, queue: number, interval: number) {
    // queue是当前时间举例1970-01-01的秒数
    let step_seconds = interval * 60;
    if ((queue - 8 * 60 * 60 + step_seconds) * 1000 > Date.now())
        return undefined;
    let nextQueue = queue + step_seconds;
    try {
        let ret = await uqOutRead(sql, queue);
        if (ret === undefined) {
            ret = { lastPointer: nextQueue, data: [] };
        }
        return ret;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function uqOutRead(sql: string, maxId: string | number, endPoint?: string | number): Promise<DataPullResult> {
    // let iMaxId = maxId === "" ? 0 : Number(maxId);
    let param = [{ name: 'iMaxId', value: maxId }];
    if (endPoint) {
        param.push({ name: 'endPoint', value: endPoint });
    }
    try {
        return await readMany(sql, param);
    } catch (error) {
        console.error(error);
        console.error('读取来源数据库出现错误');
    }
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

/**
 *
 * @param sqlstring 要执行的存储过程
 * @param params
 * @returns 对象: lastId: 多个结果中最大的id值；data: 是个对象的数组，数组中的对象属性即字段名，值即字段值
 */
export async function readMany(sqlstring: string, params?: { name: string, value: any }[]): Promise<DataPullResult> {

    let result = await execSql(sqlstring, params);
    let { recordset } = result;
    let rows = recordset.length;
    if (rows === 0) return;

    return { lastPointer: recordset[rows - 1].ID, data: recordset };
}