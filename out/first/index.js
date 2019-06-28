"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("config"));
const settings_1 = require("../settings");
const uq_joint_1 = require("../uq-joint");
const pulls_1 = require("./pulls");
const uqOutRead_1 = require("./converter/uqOutRead");
const host_1 = require("../uq-joint/tool/host");
const centerApi_1 = require("../uq-joint/tool/centerApi");
const tools_1 = require("../mssql/tools");
const maxRows = config_1.default.get("firstMaxRows");
const promiseSize = config_1.default.get("promiseSize");
(async function () {
    console.log(process.env.NODE_ENV);
    await host_1.host.start();
    centerApi_1.centerApi.initBaseUrl(host_1.host.centerUrl);
    await tools_1.initMssqlPool();
    let joint = new uq_joint_1.Joint(settings_1.settings);
    console.log('start');
    let start = Date.now();
    let priorEnd = start;
    for (var i = 0; i < pulls_1.pulls.length; i++) {
        let { read, uqIn } = pulls_1.pulls[i];
        let { entity, pullWrite, firstPullWrite } = uqIn;
        console.log(entity + " start at " + new Date());
        let readFunc;
        if (typeof (read) === 'string') {
            readFunc = async function (maxId) {
                return await uqOutRead_1.uqOutRead(read, maxId);
            };
        }
        else {
            readFunc = read;
        }
        let maxId = '', count = 0;
        let promises = [];
        for (;;) {
            let ret;
            try {
                ret = await readFunc(maxId);
            }
            catch (error) {
                console.error(error);
                throw error;
            }
            if (ret === undefined || count > maxRows)
                break;
            let { lastId, data: rows } = ret;
            rows.forEach(e => {
                if (firstPullWrite !== undefined) {
                    promises.push(firstPullWrite(joint, e));
                }
                else if (pullWrite !== undefined) {
                    promises.push(pullWrite(joint, e));
                }
                else {
                    promises.push(joint.uqIn(uqIn, e));
                }
                count++;
            });
            maxId = lastId;
            if (promises.length >= promiseSize) {
                let before = Date.now();
                try {
                    await Promise.all(promises);
                }
                catch (error) {
                    // debugger;
                    console.error(error);
                    throw error;
                }
                promises.splice(0);
                let after = Date.now();
                let sum = Math.round((after - start) / 1000);
                let each = Math.round(after - priorEnd);
                let eachSubmit = Math.round(after - before);
                console.log('count = ' + count + ' each: ' + each + ' sum: ' + sum + ' eachSubmit: ' + eachSubmit + 'ms; lastId: ' + lastId);
                priorEnd = after;
            }
        }
        await Promise.all(promises);
        promises.splice(0);
        console.log(entity + " end   at " + new Date());
    }
    ;
    process.exit();
})();
//# sourceMappingURL=index.js.map