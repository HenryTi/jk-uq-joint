import { settings } from "../settings";
import { Joint } from '../usq-joint';
import { pulls } from "./pulls";

const maxRows = 100;

(async function () {
    let joint = new Joint(settings);
    console.log('start');
    for (var i = 0; i < pulls.length; i++) {
        let { read, usqIn } = pulls[i];
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
            if (typeof usqIn === 'string') {
                try {
                    await joint.pushToUsq(usqIn, data);
                } catch (error) {
                    console.error(error);
                }
            }
            else {
                await usqIn(joint, data);
            }
        }
    };
    process.exit();
})();
