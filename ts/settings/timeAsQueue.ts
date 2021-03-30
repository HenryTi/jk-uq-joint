import config from 'config';
import { uqOutRead } from "../first/converter/uqOutRead";

const interval = config.get<number>("interval");

export async function timeAsQueue(sql: string, queue: number, step_seconds?: number) {
    if (!step_seconds)
        step_seconds = Math.max(interval * 10 / 1000, 300);
    if ((queue - 8 * 60 * 60 + step_seconds) * 1000 > Date.now())
        return undefined;
    let nextQueue = queue + step_seconds;
    let ret = await uqOutRead(sql, queue, nextQueue);
    if (ret === undefined) {
        ret = { lastPointer: nextQueue, data: [] };
    }
    return ret;
}