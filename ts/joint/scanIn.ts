//import { inputs } from './inputs';
import { execProc, tableFromProc } from '../db/mysql/tool';
import { mapToTuid } from './tool';
import { settings } from './settings';

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
                await usqIn(data);
            else {
                let {type} = usqIn;
                switch (type) {
                    case 'tuid': await mapToTuid(usqIn, data); break;
                }
            }
            console.log(`process in ${id} ${(date as Date).toLocaleString()}: `, body);
            await execProc('write_queue_in_p', [i, id]);
        }
    }
}
