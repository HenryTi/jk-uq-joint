"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mssql = __importStar(require("mssql"));
const connection_1 = require("./connection");
let __pool;
async function getPool() {
    if (__pool === undefined) {
        return __pool = await new mssql.ConnectionPool(connection_1.conn).connect();
    }
    else {
        return __pool;
    }
}
async function execSql(sql, params) {
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
    }
    catch (error) {
        // debugger;
        console.error(error);
    }
}
exports.execSql = execSql;
;
//# sourceMappingURL=tools.js.map