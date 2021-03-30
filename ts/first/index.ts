import config from 'config';
import { settings } from "../settings";
import { Joint, DataPullResult } from '../uq-joint';
import { pulls, UqOutConverter } from "./pulls";
import { uqOutRead } from "./converter/uqOutRead";
//import { host } from "../uq-joint/tool/host";
//import { centerApi } from "../uq-joint/tool/centerApi";
import { initMssqlPool } from '../mssql/tools';
import { logger } from '../tools/logger';
import { ProdOrTest } from 'uq-joint/out/joint';

const maxRows = config.get<number>("firstMaxRows");
const promiseSize = config.get<number>("promiseSize");
const pullEntities = config.get<string[]>("firstEntities");

(async function () {
    logger.info(process.env.NODE_ENV);
    //await host.start();
    //centerApi.initBaseUrl(host.centerUrl);

    await initMssqlPool();

    //let joint = new Joint(settings, 'test');
    let joint = new Joint(settings, config.get<ProdOrTest>('jointMode'));
    await joint.init();
    logger.info('start');
    let start = Date.now();
    let priorEnd = start;
    for (var i = 0; i < pullEntities.length; i++) {
        let { read, uqIn } = pulls[pullEntities[i]];
        if (!uqIn) break;
        let { entity, pullWrite, firstPullWrite } = uqIn;
        logger.info(entity + " start at " + new Date());

        let readFunc: UqOutConverter;
        if (typeof (read) === 'string') {
            readFunc = async function (maxId: string): Promise<DataPullResult> {
                return await uqOutRead(read as string, maxId);
            }
        }
        else {
            readFunc = read as UqOutConverter;
        }

        let maxId: string = '', count: number = 0;
        let promises: PromiseLike<any>[] = [];
        for (; ;) {
            let ret: DataPullResult;
            try {
                ret = await readFunc(maxId);
            } catch (error) {
                logger.error(error);
                throw error;
            }
            if (ret === undefined || count > maxRows) break;
            let { lastPointer, data: rows } = ret;

            rows.forEach(e => {
                if (firstPullWrite !== undefined) {
                    promises.push(firstPullWrite(joint, uqIn, e));
                } else if (pullWrite !== undefined) {
                    promises.push(pullWrite(joint, uqIn, e));
                } else {
                    promises.push(joint.uqIn(uqIn, e));
                }
                count++;
            });
            maxId = lastPointer as string;

            try {
                await pushToTonva(promises, start, priorEnd, count, lastPointer);
            } catch (error) {
                logger.error(error);
                if (error.code === "ETIMEDOUT") {
                    await pushToTonva(promises, start, priorEnd, count, lastPointer);
                } else {
                    throw error;
                }
            }
        }
        try {
            await Promise.all(promises);
        } catch (error) {
            // debugger;
            logger.error(error);
            throw error;
        }
        promises.splice(0);
        logger.info(entity + " end   at " + new Date());
    };
    process.exit();
})();

async function pushToTonva(promises: PromiseLike<any>[], start: number, priorEnd: number, count: number, lastPointer: number | string) {
    if (promises.length >= promiseSize) {
        let before = Date.now();
        await Promise.all(promises);
        promises.splice(0);
        let after = Date.now();
        let sum = Math.round((after - start) / 1000);
        let each = Math.round(after - priorEnd);
        let eachSubmit = Math.round(after - before);
        logger.info('count = ' + count + ' each: ' + each + ' sum: ' + sum + ' eachSubmit: ' + eachSubmit + 'ms; lastId: ' + lastPointer);
        priorEnd = after;
    }
}