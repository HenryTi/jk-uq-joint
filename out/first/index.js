"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const settings_1 = require("../settings");
const uq_joint_1 = require("../uq-joint");
const pulls_1 = require("./pulls");
const uqOutRead_1 = require("./converter/uqOutRead");
const maxRows = 20;
(async function () {
    let joint = new uq_joint_1.Joint(settings_1.settings);
    console.log('start');
    for (var i = 0; i < pulls_1.pulls.length; i++) {
        let { read, uqIn } = pulls_1.pulls[i];
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
        console.log(count);
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
            maxId = lastId;
            if (typeof uqIn === 'object') {
                try {
                    await joint.uqIn(uqIn, data);
                }
                catch (error) {
                    console.error(error);
                }
            }
            else {
                await uqIn(joint, data);
            }
        }
    }
    ;
    process.exit();
})();
//# sourceMappingURL=index.js.map