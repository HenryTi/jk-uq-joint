import { settings } from "../settings";
import { Joint } from '../uq-joint';
import { pulls, UqOutConverter } from "./pulls";
import { uqOutRead } from "./converter/uqOutRead";
import { host } from "../uq-joint/tool/host";
import { centerApi } from "../uq-joint/tool/centerApi";

const maxRows = 600;

(async function () {
    console.log(process.env.NODE_ENV);
    await host.start();
    centerApi.initBaseUrl(host.centerUrl);

    let joint = new Joint(settings);
    console.log('start');
    for (var i = 0; i < pulls.length; i++) {
        let { read, uqIn } = pulls[i];
        let { entity, pullWrite, firstPullWrite } = uqIn;
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
        console.log(entity + ":" + count);
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

            try {
                if (firstPullWrite !== undefined) {
                    await firstPullWrite(joint, data);
                } else if (pullWrite !== undefined) {
                    await pullWrite(joint, data);
                } else {
                    await joint.uqIn(uqIn, data);
                }
                maxId = lastId;
            } catch (error) {
                console.log(error);
            }
        }
    };
    process.exit();
})();
