import config from 'config';
import { uqOutRead } from "../first/converter/uqOutRead";

const interval = config.get<number>("interval");

export async function timeAsQueue(sql: string, queue: number, lastLength: number) {
    let topn = 30;
    topn += lastLength;
    sql = sql.replace('--topn--', topn.toString());
    let ret = await uqOutRead(sql, queue);
    if (ret !== undefined) {
        let { lastPointer, data } = ret;
        data.splice(0, lastLength);
        let lastL = data.filter(e => e.ID === lastPointer).length;
        if (lastL === 0)
            ret = undefined;
        else {
            if (queue === lastPointer)
                lastLength += lastL;
            else
                lastLength = lastL;
        }
    }

    if (ret !== undefined)
        return { lastLength: lastLength, ret: ret }
}