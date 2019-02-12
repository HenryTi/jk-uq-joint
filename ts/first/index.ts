import { settings } from "../settings";
import { Joint } from '../uq-joint';
import { pulls, UqOutConverter } from "./pulls";
import { uqOutRead } from "./converter/uqOutRead";

const maxRows = 20;

(async function () {
    let joint = new Joint(settings);
    console.log('start');
    for (var i = 0; i < pulls.length; i++) {
        let { read, uqIn } = pulls[i];
        let readFunc: UqOutConverter;
        if (typeof (read) === 'string') {
            readFunc = async function (maxId: string): Promise<{ lastId: string, data: any }> {
                return await uqOutRead(read as string, maxId);
            }
        }
        else {
            readFunc = read as UqOutConverter;
        }

        let maxId = '', count = 0;
        console.log(count);
        for (; ;) {
            count++;
            let ret: { lastId: string, data: any };
            try {
                ret = await readFunc(maxId);
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
