"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("config"));
const database_1 = require("./database");
const tables_1 = require("./tables");
const procs_1 = require("./procs");
const tool_1 = require("./tool");
//import {buildRoot} from './buildRoot';
async function upgrade() {
    let env = process.env['NODE_ENV'];
    if (env === undefined) {
        //console.log('to upgrade, please set NODE_ENV to debug or release');
        //return;
        env = process.env['NODE_ENV'] = 'debug';
        console.log('NODE_ENV=%s', process.env['NODE_ENV']);
    }
    switch (env.toLowerCase()) {
        default:
            console.log('to upgrade, please set NODE_ENV to debug or release');
            return;
        case 'debug':
        case 'release': break;
    }
    let sqlExists = database_1.existsDatabase;
    let tbl = await tool_1.tableFromSql(sqlExists);
    let exists = tbl[0];
    if (exists === undefined) {
        await tool_1.execSql(database_1.createDatabase);
        tbl = await tool_1.tableFromSql(sqlExists);
        if (tbl.length === 0) {
            console.log('Database not inited. Nothing to do this time.');
            return;
        }
    }
    let databaseName = config_1.default.get("database");
    console.log('Start upgrade database %s', databaseName);
    await tool_1.execSql(database_1.useDatabase);
    for (let i in tables_1.tableDefs) {
        let tbl = tables_1.tableDefs[i];
        let sql = tool_1.buildTableSql(tbl);
        await tool_1.execSql(sql).then(v => {
            console.log('succeed: ' + tbl.name);
        }).catch(reason => {
            console.log('error: ' + tbl.name);
            console.log(reason);
        });
    }
    for (let i in procs_1.procDefs) {
        let proc = procs_1.procDefs[i];
        let pName = proc.name;
        let procType = proc.returns === undefined ? 'PROCEDURE' : 'FUNCTION';
        console.log('CREATE ' + procType + ' ' + pName);
        let drop = 'DROP ' + procType + ' IF EXISTS ' + pName;
        await tool_1.execSql(drop);
        let sql = tool_1.buildProcedureSql(proc);
        await tool_1.execSql(sql).then(v => {
        }).catch(reason => {
            console.log(reason);
        });
    }
    //await buildRoot();
}
exports.upgrade = upgrade;
//# sourceMappingURL=upgradeDb.js.map