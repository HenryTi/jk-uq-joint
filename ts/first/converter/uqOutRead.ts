import { DataPullResult } from 'uq-joint';
import { execSql } from '../../mssql/tools';

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

/**
 * 根据指针值读取单条记录（指针参数名称必须是iMaxId) 
 * @param sql 要执行的sql语句 
 * @param queue 指针值
 * @returns object，其中:queue为新的指针；data：object，为所返回的数据
 */
export async function uqPullRead(sql: string, queue: number): Promise<{ queue: number, data: any }> {
    let ret = await readOne(sql, [{ name: 'iMaxId', value: queue }]);
    if (ret !== undefined)
        return { queue: Number(ret.lastId), data: ret.data };
}

/**
 * 读取单条记录 
 * @param sqlstring 要执行的sql语句
 * @param params 参数
 * @returns 
 */
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