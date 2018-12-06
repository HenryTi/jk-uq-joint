import { usqs } from './usqs'
import { tableFromProc, execProc } from '../db/mysql/tool';

export async function scanUsq() {
    for (let i in usqs) {
        console.log('scan usq ', i);
        for (;;) {
            let queue:number;
            let retp = await tableFromProc('read_queue_out_p', [i]);
            if (retp.length === 0) queue = 0;
            else queue = retp[0].queue;

            let func = usqs[i];
            let retUsq = await func(queue);
            if (retUsq === undefined) break;
            let {queue:retQueue, data} = retUsq;
            await execProc('write_queue_out', [i, retQueue, JSON.stringify(data)]);
            console.log(`usq queue ${retQueue}`, data);
        }
    }
}

