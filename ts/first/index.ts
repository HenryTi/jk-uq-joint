import config from 'config';
import { settings } from "../settings";
import { Joint } from '../uq-joint';
import { pulls, UqOutConverter } from "./pulls";
import { uqOutRead } from "./converter/uqOutRead";
import { host } from "../uq-joint/tool/host";
import { centerApi } from "../uq-joint/tool/centerApi";
import { initMssqlPool } from '../mssql/tools';

const maxRows = config.get<number>("firstMaxRows");
const promiseSize = config.get<number>("promiseSize");

(async function () {
    console.log(process.env.NODE_ENV);
    await host.start();
    centerApi.initBaseUrl(host.centerUrl);

    await initMssqlPool();

    let joint = new Joint(settings);
    console.log('start');
    let start = Date.now();
    let priorEnd = start;
    for (var i = 0; i < pulls.length; i++) {
        let { read, uqIn } = pulls[i];
        let { entity, pullWrite, firstPullWrite } = uqIn;
        console.log(entity + " start at " + new Date());
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
            let ret: { lastId: string, data: any };
            try {
                ret = await readFunc(maxId);
            } catch (error) {
                console.error(error);
                continue;
            }
            if (ret === undefined || count > maxRows) break;
            let { lastId, data: rows } = ret;

            rows.forEach(e => {
                try {
                    if (firstPullWrite !== undefined) {
                        promises.push(firstPullWrite(joint, e));
                    } else if (pullWrite !== undefined) {
                        promises.push(pullWrite(joint, e));
                    } else {
                        promises.push(joint.uqIn(uqIn, e));
                    }
                    count++;
                } catch (error) {
                    console.log(error);
                }
            });
            maxId = lastId;

            if (promises.length >= promiseSize) {
                let before = Date.now();
                try {
                    await Promise.all(promises);
                } catch (error) {
                    debugger;
                }
                promises.splice(0);
                let after = Date.now();
                let sum = Math.round((after - start) / 1000);
                let each = Math.round(after - priorEnd);
                let eachSubmit = Math.round(after - before);
                console.log('count = ' + count + ' each: ' + each + ' sum: ' + sum + ' eachSubmit: ' + eachSubmit + 'ms');
                priorEnd = after;
            }
        }
        await Promise.all(promises);
        promises.splice(0);
        console.log(entity + " end   at " + new Date());
    };
    process.exit();
})();