//import { usqs } from './usqs'
import { tableFromProc, execProc } from '../db/mysql/tool';
import { settings } from './settings';
import { mapFromSheet } from './tool/mapFromSheet';

export async function scanOut() {
    for (let i in settings.out) {
        console.log('scan out ', i);
        let usqOut = settings.out[i];
        for (;;) {
            let queue:number;
            let retp = await tableFromProc('read_queue_out_p', [i]);
            if (retp.length === 0) queue = 0;
            else queue = retp[0].queue;
            let data = {id: queue};
            let {id} = data;

            // 中断queue
            if (id <= queue) break;
            if (typeof usqOut === 'function')
                await usqOut(data);
            else {
                let {type} = usqOut;
                switch (type) {
                    case 'sheet': await mapFromSheet(i, usqOut, data); break;
                }
            }
            await execProc('write_queue_out_p', [i, id]);
        }
    }
}

