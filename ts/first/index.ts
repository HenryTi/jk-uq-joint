import { settings } from "../settings";
import { pulls } from "./pulls";
import { TestJoint, ProdJoint } from "../uq-joint";

const maxRows = 20;

(async function () {
    //let joint = new TestJoint(settings);
    let joint = new ProdJoint(settings);
    console.log('start');
    for (var i = 0; i < pulls.length; i++) {
        let { read, uqIn } = pulls[i];
        let maxId = '', count = 0;
        console.log(count);
        for (; ;) {
            count++;
            let ret: { lastId: string, data: any };
            try {
                ret = await read(maxId);
            } catch (error) {
                break;
            }
            if (ret === undefined || count > maxRows) break;
            let { lastId, data } = ret;
            maxId = lastId;
            if (typeof uqIn === 'object') {
                try {
                    await joint.uqIn(uqIn, data);
                } catch (error) {
                    console.error(error);
                }
            }
            else {
                await uqIn(joint, data);
            }
        }
    };
    process.exit();
})();
