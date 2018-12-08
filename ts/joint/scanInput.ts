import { inputs } from './inputs';
import { execProc, tableFromProc } from '../db/mysql/tool';
import { saveTuid } from './tool';

export async function scanInput() {
    for (let i in inputs) {
        console.log('scan input ', i);
        for (;;) {
            let retp = await tableFromProc('read_queue_in', [i]);
            if (!retp || retp.length === 0) break;
            let {id, body, date} = retp[0];
            let func = inputs[i];
            let data = JSON.parse(body);
            if (typeof func === 'function')
                await func(data);
            else
                await saveTuid(i, data, func);
            console.log(`process in ${id} ${(date as Date).toLocaleString()}: `, body);
            await execProc('write_queue_in_p', [i, id]);
        }
    }
}
