import * as mssql from 'mssql';
import { conn } from "./connection";

let __pool: mssql.ConnectionPool;

async function getPool() {
    if (__pool === undefined) {
        return __pool = await new mssql.ConnectionPool(conn).connect();
    }
    else {
        return __pool;
    }
}

export async function execSql(sql: string, params?: { name: string, value: any }[]): Promise<any> {

    try {
        let pool = await getPool();
        const request = pool.request();
        if (params !== undefined) {
            for (let p of params) {
                let { name, value } = p;
                request.input(name, value);
            }
            /*
            params.forEach(element => {
                request.input(element.name, element.value);
            });*/
        }
        const result = await request.query(sql);
        return result;
    } catch (error) {
        // debugger;
        console.error(error);
    }
};