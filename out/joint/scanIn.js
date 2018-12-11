/*
import { execProc, tableFromProc } from './db/mysql/tool';
import { usqInTuid, usqInMap, usqInAction } from './tool';
import { settings } from '../settings';
import { UsqIn } from './defines';

export async function scanIn() {
    for (let i in settings.in) {
        console.log('scan in ', i);
        let usqIn = settings.in[i];
        for (;;) {
            let retp = await tableFromProc('read_queue_in', [i]);
            if (!retp || retp.length === 0) break;
            let {id, body, date} = retp[0];
            let data = JSON.parse(body);
            if (typeof usqIn === 'function')
                await usqIn(settings, data);
            else
                await usqInDefault(usqIn, data);
            console.log(`process in ${id} ${(date as Date).toLocaleString()}: `, body);
            await execProc('write_queue_in_p', [i, id]);
        }
    }
}

export async function usqInDefault(usqIn:UsqIn, data:any) {
    let {type} = usqIn;
    switch (type) {
        case 'tuid': await usqInTuid(usqIn, data); break;
        case 'map': await usqInMap(usqIn, data); break;
        case 'action': await usqInAction(usqIn, data); break;
    }
}
*/ 
//# sourceMappingURL=scanIn.js.map