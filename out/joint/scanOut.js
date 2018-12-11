/*
//import { usqs } from './usqs'
import { tableFromProc, execProc } from './db/mysql/tool';
import { settings } from '../settings';
import { usqOutSheet } from './tool/usqOutSheet';
import { UsqOut } from './defines';

export async function scanOut() {
    for (let i in settings.out) {
        console.log('scan out ', i);
        let usqOut = settings.out[i];
        for (;;) {
            let queue:number;
            let retp = await tableFromProc('read_queue_out_p', [i]);
            if (retp.length === 0) queue = 0;
            else queue = retp[0].queue;
            let ret:{queue:number, data:any};
            if (typeof usqOut === 'function')
                ret = await usqOut(settings, queue);
            else
                ret = await usqOutDefault(usqOut, queue);
            if (ret === undefined) break;
            let {queue:newQueue, data} = ret;
            await execProc('write_queue_out', [i, newQueue, JSON.stringify(data)]);
            //await execProc('write_queue_out_p', [i, newQueue]);
        }
    }
}

export async function usqOutDefault(usqOut:UsqOut, queue:number):Promise<{queue:number, data:any}> {
    let ret:{queue:number, data:any};
    let {type} = usqOut;
    switch (type) {
        case 'sheet': ret = await usqOutSheet(usqOut, queue); break;
    }
    return ret;
}
*/ 
//# sourceMappingURL=scanOut.js.map