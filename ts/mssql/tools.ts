import * as mssql from 'mssql';
import { conn } from "./connection";
//import { init } from 'uq-joint/db/mysql/initDb';

let __pool: mssql.ConnectionPool;

export async function initMssqlPool() {
    __pool = await new mssql.ConnectionPool(conn).connect();
}

/*
async function getPool() {
    if (__pool === undefined) {
        return __pool = await new mssql.ConnectionPool(conn).connect();
    }
    else {
        return __pool;
    }

}
*/

/**
 * 
 * @param {string} sql 要执行的sql语句
 * @param params 参数列表 
 * @returns {object} object, 其中：recordset: 对象数组，其中的对象属性名对应sql语句中的字段名，属性值为字段值；rowaffected?: sql语句影响的行数
 */
export async function execSql(sql: string, params?: { name: string, value: any }[]): Promise<any> {

    try {
        const request = __pool.request();
        if (params !== undefined) {
            for (let p of params) {
                let { name, value } = p;
                request.input(name, value);
            }
        }
        const result = await request.query(sql);
        return result;
    } catch (error) {
        // debugger;
        console.error(error + ":" + sql);
        if (error.code === 'ETIMEOUT')
            await execSql(sql, params);
        else
            throw error;
    }
};