"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const settings_1 = require("../settings");
const usq_joint_1 = require("../uq-joint");
const pulls_1 = require("./pulls");
const maxRows = 20;
(async function () {
    let joint = new usq_joint_1.Joint(settings_1.settings);
    console.log('start');
    for (var i = 0; i < pulls_1.pulls.length; i++) {
        let { read, usqIn } = pulls_1.pulls[i];
        let maxId = '', count = 0;
        console.log(count);
        for (;;) {
            count++;
            let ret;
            try {
                ret = await read(maxId);
            }
            catch (error) {
                break;
            }
            if (ret === undefined || count > maxRows)
                break;
            let { lastId, data } = ret;
            maxId = lastId;
            if (typeof usqIn === 'object') {
                try {
                    await joint.usqIn(usqIn, data);
                }
                catch (error) {
                    console.error(error);
                }
            }
            else {
                await usqIn(joint, data);
            }
        }
    }
    ;
    process.exit();
})();
//# sourceMappingURL=index.js.map