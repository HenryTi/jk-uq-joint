import { settings } from "../settings";
import { Joint } from '../uq-joint';
import { pulls, UqOutConverter } from "./pulls";
import { uqOutRead } from "./converter/uqOutRead";
import { host } from "../uq-joint/tool/host";
import { centerApi } from "../uq-joint/tool/centerApi";

const maxRows = 2;

(async function () {
    console.log(process.env.NODE_ENV);
    await host.start();
    centerApi.initBaseUrl(host.centerUrl);

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
            maxId = lastId;
        }
    };
    process.exit();
})();
