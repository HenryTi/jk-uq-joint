"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readMany = exports.uqPullRead = exports.uqOutRead = void 0;
const tools_1 = require("../../mssql/tools");
async function uqOutRead(sql, maxId, endPoint) {
    // let iMaxId = maxId === "" ? 0 : Number(maxId);
    let param = [{ name: 'iMaxId', value: maxId }];
    if (endPoint) {
        param.push({ name: 'endPoint', value: endPoint });
    }
    try {
        return await readMany(sql, param);
    }
    catch (error) {
        console.error(error);
        console.error('读取来源数据库出现错误');
    }
}
exports.uqOutRead = uqOutRead;
/**
 * 根据指针值读取单条记录（指针参数名称必须是iMaxId)
 * @param sql 要执行的sql语句
 * @param queue 指针值
 * @returns object，其中:queue为新的指针；data：object，为所返回的数据
 */
async function uqPullRead(sql, queue) {
    let ret = await readOne(sql, [{ name: 'iMaxId', value: queue }]);
    if (ret !== undefined)
        return { queue: Number(ret.lastId), data: ret.data };
}
exports.uqPullRead = uqPullRead;
/**
 * 读取单条记录
 * @param sqlstring 要执行的sql语句
 * @param params 参数
 * @returns
 */
const readOne = async (sqlstring, params) => {
    let result = await tools_1.execSql(sqlstring, params);
    let { recordset } = result;
    if (recordset.length === 0)
        return;
    let prod = recordset[0];
    return { lastId: prod.ID, data: prod };
};
/**
 *
 * @param sqlstring 要执行的存储过程
 * @param params
 * @returns 对象: lastId: 多个结果中最大的id值；data: 是个对象的数组，数组中的对象属性即字段名，值即字段值
 */
async function readMany(sqlstring, params) {
    let result = await tools_1.execSql(sqlstring, params);
    let { recordset } = result;
    let rows = recordset.length;
    if (rows === 0)
        return;
    return { lastPointer: recordset[rows - 1].ID, data: recordset };
}
exports.readMany = readMany;
//# sourceMappingURL=uqOutRead.js.map