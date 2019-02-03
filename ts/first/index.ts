import { settings } from "../settings";
import { Joint } from '../usq-joint';
import { pulls, UsqOutConverter } from "./pulls";
import { usqOutRead } from "./converter/usqOutRead";

const maxRows = 20;

(async function () {
    let joint = new Joint(settings);
    console.log('start');
    for (var i = 0; i < pulls.length; i++) {
        let { read, usqIn } = pulls[i];
        let readFunc:UsqOutConverter;
        if (typeof(read) === 'string') {
            readFunc = async function(maxId:string):Promise<{ lastId: string, data: any }> {
                return await usqOutRead(read as string, maxId);
            }
        }
        else {
            readFunc = read as UsqOutConverter;
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
            if (typeof usqIn === 'object') {
                try {
                    await joint.usqIn(usqIn, data);
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
