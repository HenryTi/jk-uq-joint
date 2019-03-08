import { settings } from "../settings";
import { Joint } from '../uq-joint';
import { pulls, UqOutConverter } from "./pulls";
import { uqOutRead } from "./converter/uqOutRead";
import { host } from "../uq-joint/tool/host";
import { centerApi } from "../uq-joint/tool/centerApi";
import { getOpenApi } from "../uq-joint/tool/openApi";
import { uqs } from "../settings/uqs";

const maxRows = 1000;
(async function () {
    console.log(process.env.NODE_ENV);
    await host.start();
    centerApi.initBaseUrl(host.centerUrl);

    let joint = new Joint(settings);
    console.log('start');
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

        let maxId = '', count = 0, primiseCount = 0;
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
                    // promises.push(firstPullWrite(joint, data));
                    await firstPullWrite(joint, data);
                } else if (pullWrite !== undefined) {
                    // promises.push(pullWrite(joint, data));
                    await pullWrite(joint, data);
                } else {
                    // promises.push(joint.uqIn(uqIn, data));
                    await joint.uqIn(uqIn, data);
                }
                maxId = lastId;
            } catch (error) {
                console.log(error);
            }
            /*
            if (promises.length >= 10){
                await Promise.all(promises);
                promises.splice(0);
            }
            */
        }
        // await Promise.all(promises);
        // promises.splice(0);
        console.log(entity + " end   at " + Date.now().toString());
    };
    process.exit();
})();
/*
(async function () {

    console.log(process.env.NODE_ENV);
    await host.start();
    centerApi.initBaseUrl(host.centerUrl);

    let openApi = await getOpenApi(uqs.jkProduct, 24);
    let promises: PromiseLike<number>[] = [];
    for (let i = 0; i < 100; i++) {
        promises.push(openApi.getTuidVId("ProductX"));
    }
    let result = await Promise.all(promises);
    debugger;
})();
*/