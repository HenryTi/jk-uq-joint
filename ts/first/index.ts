import config from 'config';
import { settings } from "../settings";
import { Joint } from '../uq-joint';
import { pulls, UqOutConverter } from "./pulls";
import { uqOutRead } from "./converter/uqOutRead";
import { host } from "../uq-joint/tool/host";
import { centerApi } from "../uq-joint/tool/centerApi";

const maxRows = config.get<number>("firstMaxRows");
const promiseSize = config.get<number>("promiseSize");

(async function () {
    console.log(process.env.NODE_ENV);
    await host.start();
    centerApi.initBaseUrl(host.centerUrl);

    let joint = new Joint(settings);
    console.log('start');
    let start = new Date();
    let priorEnd = start;
    for (var i = 0; i < pulls.length; i++) {
        let { read, uqIn } = pulls[i];
        let { entity, pullWrite, firstPullWrite } = uqIn;
        console.log(entity + " start at " + Date.now());
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
        let promises: PromiseLike<any>[] = [];
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
                    promises.push(firstPullWrite(joint, data));
                } else if (pullWrite !== undefined) {
                    promises.push(pullWrite(joint, data));
                } else {
                    promises.push(joint.uqIn(uqIn, data));
                }
                maxId = lastId;
            } catch (error) {
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
    };
    process.exit();
})();