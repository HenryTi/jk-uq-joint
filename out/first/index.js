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
const maxRows = config_1.default.get("firstMaxRows");
const promiseSize = config_1.default.get("promiseSize");
(async function () {
    console.log(process.env.NODE_ENV);
    await host_1.host.start();
    centerApi_1.centerApi.initBaseUrl(host_1.host.centerUrl);
    let joint = new uq_joint_1.Joint(settings_1.settings);
    console.log('start');
    let start = new Date();
    let priorEnd = start;
    for (var i = 0; i < pulls_1.pulls.length; i++) {
        let { read, uqIn } = pulls_1.pulls[i];
        let { entity, pullWrite, firstPullWrite } = uqIn;
        console.log(entity + " start at " + Date.now());
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
            count++;
            let ret;
            try {
                ret = await readFunc(maxId);
            }
            catch (error) {
                break;
            }
            if (ret === undefined || count > maxRows)
                break;
            let { lastId, data } = ret;
            try {
                if (firstPullWrite !== undefined) {
                    promises.push(firstPullWrite(joint, data));
                }
                else if (pullWrite !== undefined) {
                    promises.push(pullWrite(joint, data));
                }
                else {
                    promises.push(joint.uqIn(uqIn, data));
                }
                maxId = lastId;
            }
            catch (error) {
                console.log(error);
            }
            if (promises.length >= promiseSize) {
                await Promise.all(promises);
                promises.splice(0);
                let t = new Date().getTime();
                let sum = Math.round((t - start.getTime()) / 1000);
                let each = Math.round((t - priorEnd.getTime()) / 1000);
                console.log('count = ' + count + ' each: ' + each + '; sum: ' + sum);
                priorEnd = new Date();
            }
        }
        await Promise.all(promises);
        promises.splice(0);
        console.log(entity + " end   at " + Date.now().toString());
    }
    ;
    process.exit();
})();
//# sourceMappingURL=index.js.map